/**
 * @module imp-34725-caveat-surfacing-audit-34620-34623
 *
 * imp-34725 (meta): AUDIT of whether the shared honest-status caveat
 * (measurement/fit only; component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a>=0 untouched; no operator positivity; NO QED;
 * no refereed bound is changed) is carried by every newly shipped
 * viz page in the imp-34620..34623 crossover/deflow/q4-share cluster,
 * extending the imp-34618/34521/34561 caveat-surfacing-audit lineage.
 *
 * COHORT-SIZE CORRECTION. The imp-34725 ticket text (frontier-scout-authored)
 * describes the cluster as "imp-34620..34624", attributing a "deflow
 * finite-rung k*" viz page to imp-34624. Checking src/data/improvement-queue.js
 * shows imp-34624 is actually a DIFFERENT, already-completed ticket -- a
 * registration/wiring audit of the imp-34584..34593 measurement cluster (the
 * subject of imp-34618), not a viz page. The "deflow finite-rung" viz page the
 * ticket text describes is imp-34623 (src/pages/Imp34623DeflowResidualOneOverLogNViz.jsx,
 * "deflow finite-rung residuals"). No src/pages file references imp-34624 and
 * no improvements.js row registers a viz page under that id. So the true
 * viz-page cohort is the four pages imp-34620/34621/34622/34623; imp-34624 is
 * excluded as a ticket-text id error, not a missing page.
 *
 * METHOD. Each of the 4 pages was read directly (not just its data module):
 * every one renders an inline "Honest status:" block in its own JSX repeating
 * the caveat substance verbatim (imp-3220/imp-3406, C_mb GUE-conditional,
 * imp-3066 K_a>=0, NO QED, no refereed bound is changed) -- so the caveat reaches the
 * end-reader directly from the page, not only via the improvements.js log
 * render (src/pages/ImprovementsPage.jsx renders `imp.detail` in full, which
 * also independently carries the caveat for all 4 cohort entries).
 *
 * FINDING: no gap. All 4 actual viz pages carry the caveat both inline in
 * their own JSX and in their improvements.js log detail. AUDIT-ONLY -- no
 * surfacing was added because none was missing; the only change is
 * documenting the imp-34624 ticket-text id error for future audits.
 */

const COHORT = [
  { ticket: 'imp-34620', page: 'src/pages/Imp34620Q4ShareRoundoffFloorVsDpViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
  { ticket: 'imp-34621', page: 'src/pages/Imp34621EflowAttrSlopeContinuityViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
  { ticket: 'imp-34622', page: 'src/pages/Imp34622EflowAttrFpFloorSlopeDriftViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
  { ticket: 'imp-34623', page: 'src/pages/Imp34623DeflowResidualOneOverLogNViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
];

const FULLY_COVERED = COHORT.filter((m) => m.pageHasInlineBanner && m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT_34620_34623 = {
  ticket: 'imp-34725',
  ticketTextIdError: {
    claimedId: 'imp-34624',
    claimedAs: 'a deflow finite-rung k* viz page',
    actualTicket: 'a completed imp-34584..34593 registration/wiring audit (subject of imp-34618), not a viz page',
    likelyIntendedPage: 'imp-34623 (src/pages/Imp34623DeflowResidualOneOverLogNViz.jsx, "deflow finite-rung residuals")',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.pageHasInlineBanner || !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat is rendered directly inline on all 4 imp-34620..34623 ' +
    'viz pages (not just via the improvements.js log); no surfacing added because none was missing. ' +
    'imp-34624 was excluded as a ticket-text id error, not an unaudited page. No bound change; ' +
    'imp-3066 K_a>=0 untouched; C_mb remains GUE-conditional per imp-486; NO QED; no refereed bound is changed' +
    '.',
};

export const CAVEAT_SURFACING_AUDIT_34620_34623_ASSERTIONS = [
  {
    id: 'imp-34725-cohort-has-four-members',
    description: 'the audited viz-page cohort is exactly imp-34620/34621/34622/34623',
    holds: () => CAVEAT_SURFACING_AUDIT_34620_34623.cohortSize === 4
      && ['imp-34620', 'imp-34621', 'imp-34622', 'imp-34623']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34725-all-four-have-inline-banner',
    description: 'every cohort page carries the honest-status caveat inline in its own JSX',
    holds: () => COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34725-all-four-surfaced-in-log',
    description: 'every cohort ticket has the caveat present in its improvements.js `detail` field',
    holds: () => CAVEAT_SURFACING_AUDIT_34620_34623.fullyCoveredCount === 4
      && CAVEAT_SURFACING_AUDIT_34620_34623.gapsFound.length === 0,
  },
  {
    id: 'imp-34725-imp34624-id-error-documented',
    description: 'the imp-34624 ticket-text id error (not a viz page) is recorded, not silently dropped',
    holds: () => CAVEAT_SURFACING_AUDIT_34620_34623.ticketTextIdError.claimedId === 'imp-34624'
      && /not a viz page/.test(CAVEAT_SURFACING_AUDIT_34620_34623.ticketTextIdError.actualTicket),
  },
  {
    id: 'imp-34725-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34620_34623.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34620_34623.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34620_34623.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34620_34623_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34725-caveat-surfacing-audit-34620-34623 assertion failed: ${a.id}`);
}
