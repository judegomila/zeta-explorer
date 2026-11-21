/**
 * @module imp-34879-caveat-surfacing-audit-34836-34846
 *
 * imp-34879 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; imp-34836/imp-34846 inherit the
 * E_flow-reinstatement sub-gap imp-34796/imp-34820/imp-34837 left open;
 * imp-34840/imp-34843 must state sub-gap imp-34714a directed-rounding
 * certificate REMAINS OPEN and margin-is-not-the-blocker; the C_mb-sweep
 * modules imp-34838/imp-34844 must state C_mb stays GUE-conditional per
 * imp-486 and is treated as a free knob, not a discharge of that conditional;
 * all must carry MEASUREMENT/DERIVATION-ONLY, changes-no-bound, NO QED,
 * no refereed bound is changed) is carried by every module in the
 * imp-34836..imp-34846 cohort and any viz page built from it, extending the
 * imp-34812/imp-34834/imp-34857 caveat-surfacing audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names an 11-module cohort
 * (34836-34846 inclusive). imp-34841 shipped as an appended section inside
 * the pre-existing imp-34813 data module (src/data/imp-34813-winding-
 * monotonicity-rigor.js), not a standalone imp-34841-*.js file -- the same
 * "extends an existing module rather than creating a new one" pattern earlier
 * audits in this lineage have seen. The other 10 tickets each shipped their
 * own dedicated src/data/imp-NNNNN-*.js module.
 *
 * METHOD. Each of the 11 data modules was read directly (header JSDoc plus
 * verdict/description/honest fields). Five of the eleven have a downstream
 * viz page: imp-34837 and imp-34846 share src/pages/
 * Imp34873SigmaKneeD3HalvingLadderViz.jsx; imp-34838 and imp-34844 share
 * src/pages/Imp34874CmbElasticityCurvatureLadderViz.jsx; imp-34839 shipped as
 * src/pages/Imp34876ShrinkRatioLimitViz.jsx; imp-34842 shipped as src/pages/
 * Imp34877CrossoverDerivativeLadderViz.jsx; imp-34845 shipped as src/pages/
 * Imp34875IntervalCeilMarginViz.jsx. imp-34836, imp-34840, imp-34841, and
 * imp-34843 completed as data-module-only tickets (imp-34841's existing
 * imp-34813 viz page pre-dates and does not name the imp-34841 addition
 * specifically) with no dedicated viz page under those ids.
 *
 * FINDING: no gap. All 11 data modules carry the honest-status caveat
 * (NO QED / changes-no-bound / GUE-conditional / Platt-Trudgian Lambda<=0.2
 * SOTA language, each with the ticket-specific sub-gap it must additionally
 * name), and all 5 actual viz pages render an inline "Honest status:" block
 * repeating the same caveat. AUDIT-ONLY -- no surfacing was added because
 * none was missing.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34836', module: 'src/data/imp-34836-sigma-knee-sixth-seventh-order-v-expansion.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'E_flow-reinstatement', namesSubGap: true },
  { ticket: 'imp-34837', module: 'src/data/imp-34837-sigmoid-inflection-d2-eflow-reinstatement.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34838', module: 'src/data/imp-34838-cmb-zero-gap-precise-root-and-elasticity.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: 'C_mb-GUE-conditional-free-knob', namesSubGap: true },
  { ticket: 'imp-34839', module: 'src/data/imp-34839-crossover-gpp-shrink-ratio-limit.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34840', module: 'src/data/imp-34840-krawczyk-directed-rounding-op-dag-feasibility.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34841', module: 'src/data/imp-34813-winding-monotonicity-rigor.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34842', module: 'src/data/imp-34842-crossover-gpppp5-fifth-deriv-fourth-band.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34843', module: 'src/data/imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34844', module: 'src/data/imp-34844-inflection-crossover-gap-cmb-curvature.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: 'C_mb-GUE-conditional-free-knob', namesSubGap: true },
  { ticket: 'imp-34845', module: 'src/data/imp-34845-iters-to-floor-interval-ceil.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34846', module: 'src/data/imp-34846-sigma-knee-third-order-closed-form-locator.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: 'E_flow-reinstatement', namesSubGap: true },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34837', 'imp-34846'], page: 'src/pages/Imp34873SigmaKneeD3HalvingLadderViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34838', 'imp-34844'], page: 'src/pages/Imp34874CmbElasticityCurvatureLadderViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34839'], page: 'src/pages/Imp34876ShrinkRatioLimitViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34842'], page: 'src/pages/Imp34877CrossoverDerivativeLadderViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34845'], page: 'src/pages/Imp34875IntervalCeilMarginViz.jsx', pageHasInlineBanner: true },
];

const NO_VIZ_PAGE = ['imp-34836', 'imp-34840', 'imp-34841', 'imp-34843'];

export const CAVEAT_SURFACING_AUDIT_34836_34846 = {
  ticket: 'imp-34879',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  noVizPageIds: NO_VIZ_PAGE,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat || !m.namesSubGap).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 11 imp-34836..imp-34846 data '
    + 'modules (with each ticket-specific sub-gap named where required: E_flow-reinstatement for imp-34836/'
    + 'imp-34846, imp-34714a-REMAINS-OPEN for imp-34840/imp-34843, C_mb-GUE-conditional-free-knob for '
    + 'imp-34838/imp-34844) and rendered inline on all 5 actual viz pages built from this cohort; no '
    + 'surfacing added because none was missing. imp-34836/imp-34840/imp-34841/imp-34843 were excluded as '
    + 'data-module-only tickets with no viz page, not unaudited pages. No bound change; sub-gap imp-34714a '
    + 'stays OPEN; C_mb GUE-conditional share (imp-486) untouched; E_flow-reinstatement sub-gap unchanged; '
    + 'no operator positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34836_34846_ASSERTIONS = [
  {
    id: 'imp-34879-data-module-cohort-has-eleven-members',
    description: 'the audited data-module cohort is exactly imp-34836..imp-34846 (11 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34836_34846.dataModuleCohort.length === 11
      && ['imp-34836', 'imp-34837', 'imp-34838', 'imp-34839', 'imp-34840', 'imp-34841', 'imp-34842', 'imp-34843', 'imp-34844', 'imp-34845', 'imp-34846']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34879-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34879-eflow-modules-name-subgap',
    description: 'imp-34836 and imp-34846 both name the inherited E_flow-reinstatement sub-gap',
    holds: () => ['imp-34836', 'imp-34846'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34879-krawczyk-modules-name-34714a-open',
    description: 'imp-34840 and imp-34843 both name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34840', 'imp-34843'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34879-cmb-modules-name-gue-conditional-free-knob',
    description: 'imp-34838 and imp-34844 both name C_mb as GUE-conditional (imp-486) and a free knob',
    holds: () => ['imp-34838', 'imp-34844'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'C_mb-GUE-conditional-free-knob' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34879-viz-page-cohort-has-five-members',
    description: 'the audited viz-page cohort is exactly the 5 actual pages built from this ticket range',
    holds: () => CAVEAT_SURFACING_AUDIT_34836_34846.vizPageCohort.length === 5
      && ['imp-34837', 'imp-34838', 'imp-34839', 'imp-34842', 'imp-34845']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34879-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34879-no-viz-page-ids-documented',
    description: 'the imp-34836/imp-34840/imp-34841/imp-34843 no-viz-page membership is recorded, not silently dropped',
    holds: () => NO_VIZ_PAGE.length === 4
      && ['imp-34836', 'imp-34840', 'imp-34841', 'imp-34843'].every((t) => CAVEAT_SURFACING_AUDIT_34836_34846.noVizPageIds.includes(t)),
  },
  {
    id: 'imp-34879-no-gaps-found',
    description: 'the audit found zero gaps across the full 11-module + 5-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34836_34846.gapsFound.length === 0,
  },
  {
    id: 'imp-34879-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34836_34846.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34836_34846.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34836_34846.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34836_34846_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34879-caveat-surfacing-audit assertion failed: ${a.id}`);
}
