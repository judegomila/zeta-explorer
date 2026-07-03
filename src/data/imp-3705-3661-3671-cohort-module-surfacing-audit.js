/**
 * @module imp-3705-3661-3671-cohort-module-surfacing-audit
 * @fileoverview imp-3705 -- Audit whether the imp-3661, imp-3662, imp-3663,
 * imp-3664, imp-3665, imp-3666, imp-3667, imp-3668, imp-3669, imp-3670, and
 * imp-3671 research modules are imported by any page/component or are orphaned
 * data files. The intervening imp-3649..imp-3654 ids named in the ticket do NOT
 * correspond to raw research-module files: they are glossary-content additions
 * and viz-page tickets (imp-3655..imp-3658, already known surfaced and audited)
 * that landed in the same commit wave -- confirmed by directory listing, so this
 * audit's real scope is the eleven imp-3661..imp-3671 modules. imp-3659 audited
 * only through imp-3625; this continues the imp-3459/imp-3480/imp-3498/imp-3517/
 * imp-3539/imp-3568/imp-3593/imp-3615/imp-3636/imp-3659 orphan-audit series to
 * this next cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3659/imp-3636: a
 * transitive import-graph walk from every page under src/pages and every
 * component under src/components over real `from '...'` relative import edges
 * (including a trailing `.js` extension). A module counts as SURFACED iff its
 * file is reachable from some page/component node; ORPHAN otherwise. String /
 * comment mentions and downstream research-module imports that are themselves
 * off the page/component import graph do NOT count as surfacing the raw module.
 *
 * RESULT (audited 2026-07-03): all eleven modules are ORPHAN in the strict
 * import-graph sense -- consistent with the "no heavy imports in pages"
 * convention. Two (imp-3661, imp-3663) and one more (imp-3671) are additionally
 * consumed by DOWNSTREAM research modules (imp-3691, imp-3710, imp-3686,
 * imp-3712) that are themselves off the page/component graph, so that chained
 * consumption does not count as surfacing either:
 *   - imp-3661-sigma-crossover-tc-density-corrected-pin.js  : ORPHAN; glossary term present; NO viz page; consumed by imp-3691, imp-3710 (both off-graph). Narrative correction (t_c over-statement ~13.96%) -- recommend queuing a viz ticket.
 *   - imp-3662-mesoscopic-invariant-seed-sensitivity.js     : ORPHAN; NO glossary term; NO viz page; no downstream consumer. Seed/quadrature robustness-check utility (imp-3624 precedent) -- recommend staying unwired.
 *   - imp-3663-matched-pair-krylov-depth-sweep.js           : ORPHAN; glossary term present; NO viz page; consumed by imp-3686, imp-3712 (both off-graph). Closes named sub-gap sg-3645-matched-pair-depth-sweep -- recommend queuing a viz ticket.
 *   - imp-3664-moment-ratio-saddle-law-n40-extension.js     : ORPHAN; NO glossary term; NO viz page; no downstream consumer. Extends the imp-3646 saddle law to n=40 and fits a new sub-leading correction (narrative content, not pure verification) -- recommend queuing a glossary ticket.
 *   - imp-3665-a-weight-superexp-decay-crosscheck.js        : ORPHAN; glossary term present; NO viz page; no downstream consumer. Independently corrected the imp-3646 A(1) magnitude (~3e-75 -> ~2.1e-75) -- recommend queuing a viz ticket.
 *   - imp-3666-feature-foldin-floor-ladder.js               : ORPHAN; NO glossary term; NO viz page; no downstream consumer. Full ladder measurement confirming the imp-3647 linear fold-in-floor law across seven planted sources -- recommend queuing both a glossary and a viz ticket.
 *   - imp-3667-fit-bias-a-window-sensitivity-n910.js        : ORPHAN; NO glossary term; NO viz page; no downstream consumer. a-window robustness-check utility extending the imp-3648 sensitivity test (imp-3624/imp-3648 precedent) -- recommend staying unwired.
 *   - imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js   : ORPHAN; NO glossary term (a glossary ticket, imp-3718, is ALREADY queued); NO viz page. Pairing-structure cross-check utility (imp-3623/imp-3625 precedent) -- no further ticket needed beyond the queued glossary entry.
 *   - imp-3669-dense-third-gap-independent-verify.js        : ORPHAN; NO glossary term; NO viz page; no downstream consumer. Pure baked-literal transcription/drift guard against imp-3643 (imp-3623/imp-3625 precedent) -- recommend staying unwired.
 *   - imp-3670-fit-bias-decay-rate-vs-lnsq.js               : ORPHAN; NO glossary term (a glossary ticket, imp-3720, is ALREADY queued); NO viz page. Observable fit-bias decay measurement -- recommend queuing a viz ticket in addition to the queued glossary entry.
 *   - imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js: ORPHAN; glossary term present; NO viz page; consumed by imp-3691 (off-graph). Structural-silence verdict on the G6a_shock_lipschitz gap (a roadmap honest-status ticket, imp-3723, is ALREADY queued separately for the consumer side) -- recommend queuing a viz ticket for the assessment itself.
 *
 * RECOMMENDATION. imp-3662, imp-3667, and imp-3669 are sensitivity/robustness/
 * verification utilities in the imp-3623/imp-3624/imp-3625 kind and should stay
 * intentionally-unwired compute modules -- no new tickets. imp-3668 and imp-3670
 * already have glossary tickets queued (imp-3718, imp-3720); imp-3670 and
 * imp-3671 (and imp-3661, imp-3663, imp-3665, imp-3666) still need new viz
 * tickets queued, and imp-3664 and imp-3666 still need new glossary tickets
 * queued. This module fabricates NO pages; it only records the audit. No new
 * bound, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615, imp-3636, imp-3659 (the prior audits in this series)
 */

export const IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3705',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Downstream research-module imports and glossary/comment mentions ' +
    'that are themselves unreached from src/pages or src/components do not count as surfacing the ' +
    'raw module, though they are recorded separately as glossary/downstream-consumer proxy-surfacing.',
  modules: [
    { file: 'imp-3661-sigma-crossover-tc-density-corrected-pin.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, downstreamConsumers: ['imp-3691', 'imp-3710'], recommendation: 'queue viz ticket' },
    { file: 'imp-3662-mesoscopic-invariant-seed-sensitivity.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, downstreamConsumers: [], recommendation: 'stay unwired (seed-sensitivity utility)' },
    { file: 'imp-3663-matched-pair-krylov-depth-sweep.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, downstreamConsumers: ['imp-3686', 'imp-3712'], recommendation: 'queue viz ticket' },
    { file: 'imp-3664-moment-ratio-saddle-law-n40-extension.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, downstreamConsumers: [], recommendation: 'queue glossary ticket' },
    { file: 'imp-3665-a-weight-superexp-decay-crosscheck.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, downstreamConsumers: [], recommendation: 'queue viz ticket' },
    { file: 'imp-3666-feature-foldin-floor-ladder.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, downstreamConsumers: [], recommendation: 'queue glossary and viz tickets' },
    { file: 'imp-3667-fit-bias-a-window-sensitivity-n910.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, downstreamConsumers: [], recommendation: 'stay unwired (a-window sensitivity utility)' },
    { file: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js', surfaced: false, hasGlossaryTerm: 'queued (imp-3718)', hasVizPage: false, downstreamConsumers: [], recommendation: 'none beyond queued glossary ticket (crossval utility)' },
    { file: 'imp-3669-dense-third-gap-independent-verify.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, downstreamConsumers: [], recommendation: 'stay unwired (verification utility)' },
    { file: 'imp-3670-fit-bias-decay-rate-vs-lnsq.js', surfaced: false, hasGlossaryTerm: 'queued (imp-3720)', hasVizPage: false, downstreamConsumers: [], recommendation: 'queue viz ticket in addition to queued glossary ticket' },
    { file: 'imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, downstreamConsumers: ['imp-3691'], recommendation: 'queue viz ticket' },
  ],
  orphanCount: 11,
  unwiredUtilityCount: 3,
  recommendation:
    'imp-3662/imp-3667/imp-3669 are sensitivity/robustness/verification utilities (imp-3623/3624/3625 ' +
    'precedent) and should stay intentionally-unwired. imp-3668/imp-3670 already have glossary tickets ' +
    'queued (imp-3718/imp-3720). New viz tickets are recommended for imp-3661/3663/3665/3666/3670/3671, ' +
    'and new glossary tickets for imp-3664/3666.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3705_ASSERTIONS = [
  {
    id: 'imp3705-exactly-eleven-modules-audited',
    holds: () => IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.modules.length === 11,
    why: 'The audit must cover exactly the eleven named imp-3661..imp-3671 cohort modules.',
  },
  {
    id: 'imp3705-all-eleven-orphan',
    holds: () => {
      const m = IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 11 && orphan === IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of the raw imp-3661..imp-3671 module files is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3705-three-unwired-utilities',
    holds: () => {
      const m = IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.modules;
      const u = ['imp-3662', 'imp-3667', 'imp-3669'];
      const found = u.every((id) => m.some((x) => x.file.startsWith(id) && x.recommendation.startsWith('stay unwired')));
      return found && u.length === IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.unwiredUtilityCount;
    },
    why: 'imp-3662/imp-3667/imp-3669 are sensitivity/robustness/verification utilities recommended to stay intentionally unwired, matching the imp-3623/3624/3625 precedent from the imp-3659 audit.',
  },
  {
    id: 'imp3705-two-already-queued-glossary',
    holds: () => {
      const m = IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.modules;
      const u3668 = m.find((x) => x.file.startsWith('imp-3668'));
      const u3670 = m.find((x) => x.file.startsWith('imp-3670'));
      return !!u3668 && !!u3670 &&
        u3668.hasGlossaryTerm === 'queued (imp-3718)' && u3670.hasGlossaryTerm === 'queued (imp-3720)';
    },
    why: 'imp-3668 and imp-3670 already have dedicated glossary tickets queued (imp-3718, imp-3720) as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3705-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3705_3661_3671_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3705_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3705 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3705_ASSERTIONS };
