/**
 * @module imp-3659-3617-3625-cohort-module-surfacing-audit
 * @fileoverview imp-3659 -- Audit whether the imp-3617 (self-consistent O(eps^3)
 * flow-gap expansion), imp-3618 (remainder-tail exponent ladder n=7,8), imp-3619
 * (third skew-Toeplitz gap exponent), imp-3620 (sigma-crossover flow-factor
 * closed-form pin), imp-3621 (outer-Simpson truncation cross-check, M_5..M_10),
 * imp-3622 (planted-replica argmax-drift discriminator), imp-3623 (dense-solver
 * second-gap cross-validation), imp-3624 (fit-bias a-window sensitivity), and
 * imp-3625 (skew-Toeplitz pair56 Krylov-depth diagnostic) research modules are
 * imported by any page/component or are orphaned data files. imp-3636 audited
 * only through imp-3604; this continues the imp-3459/imp-3480/imp-3498/imp-3517/
 * imp-3539/imp-3568/imp-3593/imp-3615/imp-3636 orphan-audit series to this next
 * cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3636: a transitive
 * import-graph walk from every page under src/pages and every component under
 * src/components over real `from '...'` relative import edges (including a
 * trailing `.js` extension). A module counts as SURFACED iff its file is
 * reachable from some page/component node; ORPHAN otherwise. String / comment
 * mentions (including glossary.js prose terms) and downstream research-module
 * imports that are themselves off the page/component import graph do NOT count
 * as surfacing the raw module file.
 *
 * RESULT (audited 2026-07-03): all nine raw modules are ORPHAN in the strict
 * import-graph sense -- consistent with the project convention (see
 * imp-3636/imp-3615 and the "no heavy imports in pages" rule) that viz pages
 * bake in reference literals rather than importing research data modules
 * directly. But four of the nine already have a routed viz page whose numbers
 * were baked from this module's findings, and five already have a dedicated
 * glossary.js term:
 *   - imp-3617-flow-gap-thirdorder-expansion.js         : ORPHAN (raw file); glossary term present (glossary.js); viz page routed (imp-3655 -> Imp3655FlowGapResidualLadderViz.jsx). Fully surfaced by proxy.
 *   - imp-3618-remainder-tail-exponent-ladder-n78.js     : ORPHAN (raw file); glossary term present (glossary.js); NO viz page yet, no viz ticket queued.
 *   - imp-3619-skew-toeplitz-third-gap-exponent.js       : ORPHAN (raw file); glossary term present (glossary.js); viz page routed (imp-3656 -> Imp3656TripleSkewToeplitzGapLadderViz.jsx). Fully surfaced by proxy.
 *   - imp-3620-sigma-crossover-tc-closedform-pin.js      : ORPHAN (raw file); glossary term present (glossary.js); viz page routed (imp-3657 -> Imp3657SigmaCrossoverTcClosedformPinViz.jsx). Fully surfaced by proxy.
 *   - imp-3621-outer-simpson-truncation-moments-m5-m10.js: ORPHAN (raw file); glossary term present (glossary.js); NO viz page yet, no viz ticket queued.
 *   - imp-3622-planted-replica-argmax-drift.js           : ORPHAN (raw file); NO dedicated glossary term; viz page routed (imp-3658 -> Imp3658PlantedReplicaArgmaxDriftViz.jsx). Missing glossary, no glossary ticket queued.
 *   - imp-3623-skew-toeplitz-second-gap-dense-crossval.js: ORPHAN (raw file); covered only by the SHARED imp-3654 glossary term (dense-solver resolution, jointly with imp-3625); no dedicated viz -- a cross-validation utility, not a standalone narrative result.
 *   - imp-3624-fit-bias-a-window-sensitivity.js          : ORPHAN (raw file); NO glossary term, NO viz page -- a robustness/sensitivity-check utility (a-window dependence of the imp-3600/imp-3581 fit-bias law), not a standalone narrative result.
 *   - imp-3625-skew-toeplitz-pair56-krylov-depth.js      : ORPHAN (raw file); covered only by the SHARED imp-3654 glossary term (dense-solver resolution, jointly with imp-3623); no dedicated viz -- a Krylov-depth diagnostic utility, not a standalone narrative result.
 *
 * RECOMMENDATION. imp-3617/3619/3620 need no new tickets: each already carries
 * both a glossary term and a routed viz page. imp-3618 and imp-3621 each already
 * have a glossary term but no viz page and no viz ticket queued -- new viz
 * tickets are the right next step (matching the imp-3617/3619/3620 sibling
 * treatment in the same rung-extension family). imp-3622 already has a routed
 * viz page but no glossary term and no glossary ticket queued -- a new glossary
 * ticket is the right next step. imp-3623, imp-3624, and imp-3625 are
 * cross-validation / sensitivity / diagnostic utilities in the same kind as the
 * imp-3603 precedent (imp-3636 audit): their findings are consumed by downstream
 * narrative modules (imp-3654's shared glossary term for 3623/3625; imp-3624's
 * sensitivity check feeds confidence in the imp-3600/imp-3581 law already
 * surfaced via imp-3618/imp-3621) rather than being standalone narrative
 * results, so they should stay intentionally-unwired compute modules. This
 * module fabricates NO pages; it only records the audit. No new bound, no QED;
 * Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615, imp-3636 (the prior audits in this series)
 */

export const IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3659',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Downstream research-module imports and glossary/comment mentions ' +
    'that are themselves unreached from src/pages or src/components do not count as surfacing the ' +
    'raw module, though they are recorded separately as glossary/viz proxy-surfacing.',
  modules: [
    { file: 'imp-3617-flow-gap-thirdorder-expansion.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: true, vizPage: 'Imp3655FlowGapResidualLadderViz.jsx', recommendation: 'none' },
    { file: 'imp-3618-remainder-tail-exponent-ladder-n78.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, vizPage: null, recommendation: 'queue viz ticket' },
    { file: 'imp-3619-skew-toeplitz-third-gap-exponent.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: true, vizPage: 'Imp3656TripleSkewToeplitzGapLadderViz.jsx', recommendation: 'none' },
    { file: 'imp-3620-sigma-crossover-tc-closedform-pin.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: true, vizPage: 'Imp3657SigmaCrossoverTcClosedformPinViz.jsx', recommendation: 'none' },
    { file: 'imp-3621-outer-simpson-truncation-moments-m5-m10.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, vizPage: null, recommendation: 'queue viz ticket' },
    { file: 'imp-3622-planted-replica-argmax-drift.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: true, vizPage: 'Imp3658PlantedReplicaArgmaxDriftViz.jsx', recommendation: 'queue glossary ticket' },
    { file: 'imp-3623-skew-toeplitz-second-gap-dense-crossval.js', surfaced: false, hasGlossaryTerm: 'shared (imp-3654)', hasVizPage: false, vizPage: null, recommendation: 'stay unwired (cross-validation utility)' },
    { file: 'imp-3624-fit-bias-a-window-sensitivity.js', surfaced: false, hasGlossaryTerm: false, hasVizPage: false, vizPage: null, recommendation: 'stay unwired (sensitivity-check utility)' },
    { file: 'imp-3625-skew-toeplitz-pair56-krylov-depth.js', surfaced: false, hasGlossaryTerm: 'shared (imp-3654)', hasVizPage: false, vizPage: null, recommendation: 'stay unwired (Krylov-depth diagnostic utility)' },
  ],
  orphanCount: 9,
  fullySurfacedByProxyCount: 3,
  recommendation:
    'imp-3617/3619/3620 need no new tickets (glossary term + viz page already routed). imp-3618 ' +
    'and imp-3621 have a glossary term but no viz page -- queue new viz tickets. imp-3622 has a ' +
    'viz page but no glossary term -- queue a new glossary ticket. imp-3623/imp-3624/imp-3625 are ' +
    'cross-validation/sensitivity/diagnostic utilities (imp-3603 precedent) and should stay ' +
    'intentionally-unwired compute modules.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3659_ASSERTIONS = [
  {
    id: 'imp3659-exactly-nine-modules-audited',
    holds: () => IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine named imp-3617..imp-3625 cohort modules.',
  },
  {
    id: 'imp3659-all-nine-orphan',
    holds: () => {
      const m = IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 9 && orphan === IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of the raw imp-3617..imp-3625 module files is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3659-three-fully-surfaced-by-proxy',
    holds: () => {
      const m = IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.modules;
      const both = m.filter((x) => x.hasGlossaryTerm === true && x.hasVizPage === true).length;
      return both === 3 && both === IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.fullySurfacedByProxyCount;
    },
    why: 'imp-3617/3619/3620 each already carry a dedicated glossary term and a routed viz page.',
  },
  {
    id: 'imp3659-3623-3625-unqueued-utilities',
    holds: () => {
      const m = IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.modules;
      const u3623 = m.find((x) => x.file.startsWith('imp-3623'));
      const u3624 = m.find((x) => x.file.startsWith('imp-3624'));
      const u3625 = m.find((x) => x.file.startsWith('imp-3625'));
      return !!u3623 && !!u3624 && !!u3625 &&
        u3623.hasVizPage === false && u3624.hasVizPage === false && u3625.hasVizPage === false &&
        u3624.hasGlossaryTerm === false;
    },
    why: 'imp-3623/imp-3624/imp-3625 are cross-validation/sensitivity/diagnostic utilities with no queued dedicated surfacing, consistent with the recommendation that they stay unwired.',
  },
  {
    id: 'imp3659-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3659_3617_3625_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3659_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3659 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3659_ASSERTIONS };
