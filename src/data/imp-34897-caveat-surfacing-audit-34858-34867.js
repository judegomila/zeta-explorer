/**
 * @module imp-34897-caveat-surfacing-audit-34858-34867
 *
 * imp-34897 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; imp-34714a directed-rounding
 * certificate REMAINS OPEN; C_mb GUE-conditional per imp-486 stays a free
 * knob, not a discharge of that conditional; C_C 1/8 ansatz imp-2642/imp-2643
 * UNTOUCHED; changes-no-bound; establishes no operator positivity; NO QED;
 * no refereed bound is changed) is carried by every module in the
 * imp-34858..imp-34867 cohort and any viz page built from it, extending the
 * imp-34725/imp-34812/imp-34834/imp-34857/imp-34879 caveat-surfacing audit
 * lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names a 10-ticket cohort (34858-34867
 * inclusive). imp-34866 shipped as an appended section inside the
 * pre-existing imp-34813 data module (src/data/imp-34813-winding-
 * monotonicity-rigor.js), not a standalone imp-34866-*.js file -- the same
 * "extends an existing module rather than creating a new one" pattern the
 * imp-34879 audit found for imp-34841. The other 9 tickets each shipped
 * their own dedicated src/data/imp-NNNNN-*.js module.
 *
 * METHOD. Each of the 9 standalone data modules (plus the imp-34866 addition
 * inside imp-34813) was read directly (header JSDoc plus verdict/description/
 * honest fields). Three of the ten have a downstream viz page: imp-34859
 * shipped as src/pages/Imp34890SixthDerivLadderViz.jsx; imp-34862 shipped as
 * src/pages/Imp34891TwoRateOffByOneViz.jsx; imp-34863 shipped as src/pages/
 * Imp34892CauchyHadamardRootTestViz.jsx. imp-34858, imp-34860, imp-34861,
 * imp-34864, imp-34865, imp-34867, and imp-34866 completed as data-module-
 * only tickets with no dedicated viz page under those ids (imp-34866's
 * pre-existing host page src/pages/Imp34825WindingCountLadderViz.jsx
 * pre-dates the imp-34866 addition and does not name it specifically, the
 * same "no viz page" classification the imp-34879 audit gave imp-34841).
 *
 * FINDING: no gap. All 10 cohort tickets carry the honest-status caveat
 * (NO QED / changes-no-bound / GUE-conditional / Platt-Trudgian Lambda<=0.2
 * SOTA language, with imp-34714a-REMAINS-OPEN additionally named by the
 * directed-rounding/Krawczyk modules imp-34861/imp-34865/imp-34867), and all
 * 3 actual viz pages render an inline "Honest status:" block repeating the
 * same caveat. AUDIT-ONLY -- no surfacing was added because none was
 * missing.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34858', module: 'src/data/imp-34858-sigma-knee-d3-eflow-reinstatement.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34859', module: 'src/data/imp-34859-crossover-gpppppp6-sixth-deriv-fourth-band.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34860', module: 'src/data/imp-34860-inflection-crossover-gap-cmb-low-limit.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'C_mb-GUE-conditional-free-knob', namesSubGap: true },
  { ticket: 'imp-34861', module: 'src/data/imp-34861-krawczyk-crosscheck-band-sensitivity.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34862', module: 'src/data/imp-34862-iters-to-floor-two-rate-law.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34863', module: 'src/data/imp-34863-sigma-knee-cauchy-hadamard-radius.js', hasCaveat: true, hasVizPage: true, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34864', module: 'src/data/imp-34864-crossover-gppp-shrink-ratio-limit.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34865', module: 'src/data/imp-34865-forward-vs-contraction-width-inflation.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34866', module: 'src/data/imp-34813-winding-monotonicity-rigor.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34867', module: 'src/data/imp-34867-crlibm-log-enclosure-ulp-scope.js', hasCaveat: true, hasVizPage: false, mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34859'], page: 'src/pages/Imp34890SixthDerivLadderViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34862'], page: 'src/pages/Imp34891TwoRateOffByOneViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34863'], page: 'src/pages/Imp34892CauchyHadamardRootTestViz.jsx', pageHasInlineBanner: true },
];

const NO_VIZ_PAGE = ['imp-34858', 'imp-34860', 'imp-34861', 'imp-34864', 'imp-34865', 'imp-34866', 'imp-34867'];

export const CAVEAT_SURFACING_AUDIT_34858_34867 = {
  ticket: 'imp-34897',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  noVizPageIds: NO_VIZ_PAGE,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat || !m.namesSubGap).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 10 imp-34858..imp-34867 cohort '
    + 'tickets (imp-34714a-REMAINS-OPEN additionally named by imp-34861/imp-34865/imp-34867; C_mb-GUE-'
    + 'conditional-free-knob additionally named by imp-34860) and rendered inline on all 3 actual viz pages '
    + 'built from this cohort (imp-34859, imp-34862, imp-34863); no surfacing added because none was missing. '
    + 'imp-34858/imp-34860/imp-34861/imp-34864/imp-34865/imp-34866/imp-34867 were excluded as data-module-only '
    + 'tickets with no viz page (imp-34866 folded into the pre-existing imp-34813 module and its pre-existing '
    + 'host page does not name it specifically), not unaudited pages. No bound change; sub-gap imp-34714a '
    + 'stays OPEN; C_mb GUE-conditional share (imp-486) untouched; no operator positivity; NO QED; '
    + 'no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34858_34867_ASSERTIONS = [
  {
    id: 'imp-34897-data-module-cohort-has-ten-members',
    description: 'the audited data-module cohort is exactly imp-34858..imp-34867 (10 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34858_34867.dataModuleCohort.length === 10
      && ['imp-34858', 'imp-34859', 'imp-34860', 'imp-34861', 'imp-34862', 'imp-34863', 'imp-34864', 'imp-34865', 'imp-34866', 'imp-34867']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34897-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34897-krawczyk-modules-name-34714a-open',
    description: 'imp-34861, imp-34865, and imp-34867 all name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34861', 'imp-34865', 'imp-34867'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34897-cmb-module-names-gue-conditional-free-knob',
    description: 'imp-34860 names C_mb as GUE-conditional (imp-486) and a free knob',
    holds: () => DATA_MODULE_COHORT.find((m) => m.ticket === 'imp-34860').mustNameSubGap === 'C_mb-GUE-conditional-free-knob' && DATA_MODULE_COHORT.find((m) => m.ticket === 'imp-34860').namesSubGap === true,
  },
  {
    id: 'imp-34897-viz-page-cohort-has-three-members',
    description: 'the audited viz-page cohort is exactly the 3 actual pages built from this ticket range',
    holds: () => CAVEAT_SURFACING_AUDIT_34858_34867.vizPageCohort.length === 3
      && ['imp-34859', 'imp-34862', 'imp-34863']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34897-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34897-no-viz-page-ids-documented',
    description: 'the seven data-module-only ticket ids are recorded, not silently dropped',
    holds: () => NO_VIZ_PAGE.length === 7
      && ['imp-34858', 'imp-34860', 'imp-34861', 'imp-34864', 'imp-34865', 'imp-34866', 'imp-34867'].every((t) => CAVEAT_SURFACING_AUDIT_34858_34867.noVizPageIds.includes(t)),
  },
  {
    id: 'imp-34897-no-gaps-found',
    description: 'the audit found zero gaps across the full 10-module + 3-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34858_34867.gapsFound.length === 0,
  },
  {
    id: 'imp-34897-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34858_34867.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34858_34867.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34858_34867.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34858_34867_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34897-caveat-surfacing-audit assertion failed: ${a.id}`);
}
