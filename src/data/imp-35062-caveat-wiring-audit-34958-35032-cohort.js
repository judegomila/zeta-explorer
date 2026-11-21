/**
 * @module imp-35062-caveat-wiring-audit-34958-35032-cohort
 *
 * imp-35062 (meta): caveat-surfacing + orphaned-assertion-wiring audit of the
 * imp-34958..35032 viz/data cohort. The imp-35007/35020 caveat-audit lineage stops
 * enumeration at page id 34957, and the imp-34896/34920/34945/34967/35032/35053 orphaned-
 * assertion-wiring lineage had, before this ticket, most recently closed the gap on
 * imp-35018 alone (imp-35053). This ticket re-derives the full cohort membership
 * programmatically rather than by hand, to check whether imp-35018 or imp-35030 (the two
 * modules the ticket names) or any sibling in the id range still has a gap.
 *
 * METHOD. (1) Ran scripts/audit-viz-data-completeness.mjs (imp-35046) over all
 * src/data/*-viz-data.js modules and filtered its three findings lists to filenames whose
 * imp-NNNNN stem falls in [34958, 35032]. (2) Listed src/data/*.js by filename for any
 * other imp-NNNNN stem in that range, since the automated script only globs the
 * "*-viz-data.js" suffix. (3) For imp-35030 specifically -- named in the ticket but absent
 * from the *-viz-data.js glob -- read its page (src/pages/Imp35030FarTailInflectionOffsetLadderViz.jsx)
 * to find which data module it actually imports, then checked that module (imp-34948's,
 * outside the nominal id range) for the banner and grepped run-assertions.mjs for its wiring.
 *
 * FINDING (imp-35018, in-range): the automated script's three checks (banner / assertion-
 * wiring / index-discoverability) were re-run live. Banner: PRESENT. Assertion wiring:
 * NOW WIRED -- imp-35053 (commit b1ccef1b, this same session) already added
 * '/src/data/imp-35018-four-landmark-cluster-log-n-viz-data.js' to run-assertions.mjs's
 * DATA_MODULES array, closing the exact gap imp-35047 first flagged. Index discoverability:
 * still orphaned (present in App.jsx and the EXEMPT_FROM_INDEX backlog, absent from
 * visualizations-index.js) -- an already-known, separately-tracked gap (imp-35063), not a
 * caveat or wiring gap, so out of this ticket's explicit scope.
 *
 * FINDING (imp-35030, named in ticket, NOT in the *-viz-data.js glob): imp-35030 has no
 * dedicated data module of its own -- its page imports
 * IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION directly from
 * src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js (a pre-existing module
 * outside the 34958..35032 range, predating this cohort). That module already carries the
 * NO QED banner and its 7-assertion array is already listed in run-assertions.mjs (verified
 * by imp-35032, predating this audit). Zero gap on imp-35030's actual data dependency.
 *
 * FINDING (script blind spot, informational): scripts/audit-viz-data-completeness.mjs
 * globs only files matching "*-viz-data.js". imp-34948's module (which DOES export a
 * self-executing _ASSERTIONS array, and which imp-35030 depends on) is named
 * "imp-34948-inflection-offset-far-tail-ladder-extension.js" and so is silently skipped by
 * that scan -- it happens to already be wired (verified independently here by direct grep),
 * so there is no live gap today, but the script would not have caught it if it weren't.
 * Any future non-"-viz-data.js"-named data module with an unwired assertion array would
 * pass the imp-35046 script's exit-code check unnoticed. Not fixed here (would require
 * broadening the glob and revalidating all 154+ results, a distinct scoped ticket); flagged
 * for a follow-up wiring-lineage ticket.
 *
 * FINDING (no other in-range modules): grepping src/data/*.js filenames for any other
 * imp-NNNNN stem in [34958, 35032] beyond imp-35018 turned up none -- the remaining ids in
 * that range in the queue (imp-34990, imp-35009, imp-35021, imp-35022, imp-35024, imp-35026,
 * imp-35045, imp-35048..35066) are either measurement/content/audit tickets that produce no
 * new data module, or are still PENDING in the queue (e.g. imp-35022, imp-35026, imp-35048),
 * so no code exists yet to audit for them.
 *
 * AUDIT-ONLY -- no banner, wiring, or index changes made here; the one open item
 * (imp-35018 index discoverability) is already tracked by imp-35063.
 */

const AUDIT_SCOPE = {
  cohortRange: [34958, 35032],
  namedInTicket: ['imp-35018', 'imp-35030'],
};

const IMP35018_AUDIT = {
  dataModule: 'src/data/imp-35018-four-landmark-cluster-log-n-viz-data.js',
  hasNoQedBanner: true,
  assertionArrayWiredInRunAssertions: true,
  wiredByTicket: 'imp-35053',
  indexDiscoverabilityGapFound: true,
  indexGapTrackedByTicket: 'imp-35063',
};

const IMP35030_AUDIT = {
  page: 'src/pages/Imp35030FarTailInflectionOffsetLadderViz.jsx',
  hasOwnDataModule: false,
  actualDataDependency: 'src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js',
  dependencyHasNoQedBanner: true,
  dependencyAssertionArrayWiredInRunAssertions: true,
  gapFound: false,
};

const SCRIPT_BLIND_SPOT_AUDIT = {
  script: 'scripts/audit-viz-data-completeness.mjs',
  globPattern: '*-viz-data.js',
  missesNonConformingNames: true,
  concreteExample: 'src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js',
  liveGapToday: false,
  fixedHere: false,
};

export const IMP35062_CAVEAT_WIRING_AUDIT_34958_35032_COHORT = {
  ticket: 'imp-35062',
  scope: AUDIT_SCOPE,
  imp35018Audit: IMP35018_AUDIT,
  imp35030Audit: IMP35030_AUDIT,
  scriptBlindSpotAudit: SCRIPT_BLIND_SPOT_AUDIT,
  honest:
    'AUDIT-ONLY -- imp-35018 carries the honest-status banner and, as of imp-35053 (this same '
    + 'session), is now wired into run-assertions.mjs; its remaining index-discoverability gap '
    + 'is a distinct, already-queued concern (imp-35063), not a caveat or wiring gap. imp-35030 '
    + 'has no dedicated data module of its own -- it depends on the pre-existing, already-banner- '
    + 'ed and already-wired imp-34948 module -- so it has zero gap on either axis. No other '
    + 'in-range module exists yet to audit. A non-fatal blind spot was found in the imp-35046 '
    + 'completeness script (its glob only matches "*-viz-data.js" filenames, which would miss a '
    + 'differently-named module with an unwired assertion array), noted for a future ticket but '
    + 'not fixed here. Changes no bound; establishes no operator positivity; no RH verdict, NO '
    + 'QED. No refereed bound is changed.',
};

export const IMP35062_CAVEAT_WIRING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-35062-imp35018-banner-and-wiring-clean',
    description: 'imp-35018 carries the banner and is wired into run-assertions.mjs',
    holds: () =>
      IMP35018_AUDIT.hasNoQedBanner === true &&
      IMP35018_AUDIT.assertionArrayWiredInRunAssertions === true,
  },
  {
    id: 'imp-35062-imp35018-index-gap-tracked-not-in-scope',
    description: 'the remaining imp-35018 discoverability gap is tracked by a distinct ticket',
    holds: () =>
      IMP35018_AUDIT.indexDiscoverabilityGapFound === true &&
      IMP35018_AUDIT.indexGapTrackedByTicket === 'imp-35063',
  },
  {
    id: 'imp-35062-imp35030-dependency-clean',
    description: 'imp-35030 depends on an already-banner-ed, already-wired module and has zero own gap',
    holds: () =>
      IMP35030_AUDIT.hasOwnDataModule === false &&
      IMP35030_AUDIT.dependencyHasNoQedBanner === true &&
      IMP35030_AUDIT.dependencyAssertionArrayWiredInRunAssertions === true &&
      IMP35030_AUDIT.gapFound === false,
  },
  {
    id: 'imp-35062-script-blind-spot-noted-not-fixed',
    description: 'the audit-viz-data-completeness.mjs glob blind spot is flagged informationally, unfixed',
    holds: () =>
      SCRIPT_BLIND_SPOT_AUDIT.missesNonConformingNames === true &&
      SCRIPT_BLIND_SPOT_AUDIT.liveGapToday === false &&
      SCRIPT_BLIND_SPOT_AUDIT.fixedHere === false,
  },
  {
    id: 'imp-35062-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP35062_CAVEAT_WIRING_AUDIT_34958_35032_COHORT.honest) &&
      /refereed bound is changed/i.test(IMP35062_CAVEAT_WIRING_AUDIT_34958_35032_COHORT.honest),
  },
];

for (const a of IMP35062_CAVEAT_WIRING_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35062-caveat-wiring-audit assertion failed: ${a.id}`);
  }
}
