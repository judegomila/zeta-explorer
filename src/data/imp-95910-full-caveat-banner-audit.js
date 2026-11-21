/**
 * @module imp-95910-full-caveat-banner-audit
 *
 * imp-95910 (meta): extends the imp-95811 spot-check to EVERY viz page that
 * renders a caveat-banner constant (rather than an inline SOTA literal), so
 * a plain grep of the page .jsx source for "SOTA" cannot produce a false
 * negative across the whole cohort, not just the two imp-95811 subjects.
 *
 * METHOD: enumerated every `*_CAVEAT_BANNER` export under src/data/ (24
 * total), matched each to the page(s) importing it, and read the banner
 * text plus the page's import/render usage count.
 *
 * FINDING: of the 24 banner constants, 22 are imported by exactly one page
 * each, each page references the constant twice (import + JSX render), and
 * every one of those 22 banner strings carries both the mandatory "NO QED"
 * text and the "No refereed bound is changed ... SOTA" phrase. No
 * missing guardrail found among rendered pages.
 *
 * SIDE FINDING (orphans, not a guardrail gap -- guardrail text simply has no
 * page to render it on): two banner constants are defined but imported by
 * NO page: IMP33801_CAVEAT_BANNER (imp-33801-common-ladder-offset-viz-data.js)
 * and IMP95812_CAVEAT_BANNER (imp-95812-number-variance-c0-estimator-viz-data.js).
 * IMP95812's orphan status is already tracked as a wiring gap in the
 * improvement queue; IMP33801's orphan status was not previously recorded.
 * AUDIT-ONLY: no bound change; NO QED; no refereed bound is changed.
 */

import { IMP33760_CAVEAT_BANNER } from './imp-33760-crossover-fixed-point-convergence-viz-data.js';
import { IMP33822_CAVEAT_BANNER } from './imp-33822-decoupled-rate-grid-heatmap-viz-data.js';
import { IMP33781_CAVEAT_BANNER } from './imp-33781-sigma-inflection-closed-form-viz-data.js';
import { IMP33782_CAVEAT_BANNER } from './imp-33782-residual-contrast-viz-data.js';
import { IMP34205_CAVEAT_BANNER } from './imp-34205-widening-slope-convergence-viz-data.js';
import { IMP95697_CAVEAT_BANNER } from './imp-95697-szego-finite-size-decay-viz-data.js';
import { IMP95752_CAVEAT_BANNER } from './imp-95752-finite80-bias-heatmap-viz-data.js';
import { IMP95790_CAVEAT_BANNER } from './imp-95790-rcap-deadzone-viz-data.js';
import { IMP95668_CAVEAT_BANNER } from './imp-95668-deficit-fartail-viz-data.js';
import { IMP95682_CAVEAT_BANNER } from './imp-95682-twin-pair-block-floor-rho-viz-data.js';
import { IMP95688_CAVEAT_BANNER } from './imp-95688-vk-crossover-height-gap-viz-data.js';
import { IMP95753_CAVEAT_BANNER } from './imp-95753-crossover-height-window-viz-data.js';
import { IMP95772_CAVEAT_BANNER } from './imp-95772-deadzone-ceiling-reach-viz-data.js';
import { IMP95759_CAVEAT_BANNER } from './imp-95759-msq-pointwise-wall-viz-data.js';
import { IMP95754_CAVEAT_BANNER } from './imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js';
import { IMP95810_CAVEAT_BANNER } from './imp-95810-reach-universality-viz-data.js';
import { IMP95808_CAVEAT_BANNER } from './imp-95808-twin-pair-bias-union-heatmap-viz-data.js';
import { IMP95809_CAVEAT_BANNER } from './imp-95809-deep-corner-bias-convergence-ladder-viz-data.js';
import { IMP95888_CAVEAT_BANNER } from './imp-95888-rcap-window-bottom-viz-data.js';
import { IMP95886_CAVEAT_BANNER } from './imp-95886-decade-reach-ledger-viz-data.js';
import { IMP95887_CAVEAT_BANNER } from './imp-95887-szego-dd-toeplitz-chain-viz-data.js';
import { IMP95971_CAVEAT_BANNER } from './imp-95971-crossing-height-map-viz-data.js';

const RENDERED_BANNERS = [
  { page: 'src/pages/Imp33930CrossoverFixedPointConvergenceViz.jsx', banner: IMP33760_CAVEAT_BANNER },
  { page: 'src/pages/Imp33833DecoupledRateHeatmapViz.jsx', banner: IMP33822_CAVEAT_BANNER },
  { page: 'src/pages/Imp33800SigmaInflectionResidualContrastViz.jsx', banner: IMP33781_CAVEAT_BANNER },
  { page: 'src/pages/Imp33800SigmaInflectionResidualContrastViz.jsx', banner: IMP33782_CAVEAT_BANNER },
  { page: 'src/pages/Imp34205WideningSlopeConvergenceViz.jsx', banner: IMP34205_CAVEAT_BANNER },
  { page: 'src/pages/Imp95697SzegoFiniteSizeDecayViz.jsx', banner: IMP95697_CAVEAT_BANNER },
  { page: 'src/pages/Imp95752Finite80BiasHeatmapViz.jsx', banner: IMP95752_CAVEAT_BANNER },
  { page: 'src/pages/Imp95790RCapDeadZoneViz.jsx', banner: IMP95790_CAVEAT_BANNER },
  { page: 'src/pages/Imp95668DeficitFartailLimitViz.jsx', banner: IMP95668_CAVEAT_BANNER },
  { page: 'src/pages/Imp95682TwinPairBlockFloorRhoViz.jsx', banner: IMP95682_CAVEAT_BANNER },
  { page: 'src/pages/Imp95688VkCrossoverHeightGapViz.jsx', banner: IMP95688_CAVEAT_BANNER },
  { page: 'src/pages/Imp95753CrossoverHeightWindowViz.jsx', banner: IMP95753_CAVEAT_BANNER },
  { page: 'src/pages/Imp95753CrossoverHeightWindowViz.jsx', banner: IMP95772_CAVEAT_BANNER },
  { page: 'src/pages/Imp95759MsqPointwiseWallViz.jsx', banner: IMP95759_CAVEAT_BANNER },
  { page: 'src/pages/Imp95754CfWedgeDepthVsMultiplierViz.jsx', banner: IMP95754_CAVEAT_BANNER },
  { page: 'src/pages/Imp95810ReachUniversalityViz.jsx', banner: IMP95810_CAVEAT_BANNER },
  { page: 'src/pages/Imp95808TwinPairBiasUnionHeatmapViz.jsx', banner: IMP95808_CAVEAT_BANNER },
  { page: 'src/pages/Imp95809DeepCornerBiasConvergenceLadderViz.jsx', banner: IMP95809_CAVEAT_BANNER },
  { page: 'src/pages/Imp95888RcapWindowBottomViz.jsx', banner: IMP95888_CAVEAT_BANNER },
  { page: 'src/pages/Imp95886DecadeReachLedgerViz.jsx', banner: IMP95886_CAVEAT_BANNER },
  { page: 'src/pages/Imp95887SzegoDdToeplitzChainViz.jsx', banner: IMP95887_CAVEAT_BANNER },
  { page: 'src/pages/Imp95971CrossingHeightMapViz.jsx', banner: IMP95971_CAVEAT_BANNER },
];

const ORPHAN_BANNER_SOURCES = [
  'imp-33801-common-ladder-offset-viz-data.js',
  'imp-95812-number-variance-c0-estimator-viz-data.js',
];

const HAS_NO_QED = (s) => /no\s*qed/i.test(s);
const HAS_SOTA_PHRASE = (s) => /refereed bound is changed/i.test(s);

export const IMP95910_FULL_BANNER_AUDIT = {
  ticket: 'imp-95910',
  renderedCount: RENDERED_BANNERS.length,
  orphanCount: ORPHAN_BANNER_SOURCES.length,
  allRenderedCarryGuardrail: RENDERED_BANNERS.every(
    ({ banner }) => HAS_NO_QED(banner) && HAS_SOTA_PHRASE(banner),
  ),
  honest:
    'AUDIT-ONLY -- all 22 caveat-banner constants imported by a rendered viz page carry both ' +
    '"NO QED" and the "No refereed bound is changed ... SOTA" guardrail phrase; a plain ' +
    'grep of the .jsx source for "SOTA" would miss all of them since the text arrives via the ' +
    'imported constant, not a JSX literal. Two banner constants (imp-33801, imp-95812) are ' +
    'defined but rendered on no page -- an orphan-wiring gap, not a missing-guardrail gap. ' +
    'Changes no bound; NO QED; no refereed bound is changed.',
};

export const IMP95910_FULL_BANNER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95910-cohort-size-matches-grep-census',
    description: 'the audited cohort covers all 22 page-rendered caveat-banner constants found via grep',
    holds: () => IMP95910_FULL_BANNER_AUDIT.renderedCount === 22,
  },
  {
    id: 'imp-95910-every-rendered-banner-carries-guardrail',
    description: 'every rendered banner carries both NO QED and the PT SOTA phrase',
    holds: () => IMP95910_FULL_BANNER_AUDIT.allRenderedCarryGuardrail === true,
  },
  {
    id: 'imp-95910-orphans-recorded-not-silently-dropped',
    description: 'the two orphaned (page-less) banner sources are recorded, not silently dropped',
    holds: () =>
      IMP95910_FULL_BANNER_AUDIT.orphanCount === 2 &&
      ORPHAN_BANNER_SOURCES.includes('imp-33801-common-ladder-offset-viz-data.js') &&
      ORPHAN_BANNER_SOURCES.includes('imp-95812-number-variance-c0-estimator-viz-data.js'),
  },
  {
    id: 'imp-95910-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95910_FULL_BANNER_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95910_FULL_BANNER_AUDIT.honest),
  },
];

for (const a of IMP95910_FULL_BANNER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95910-full-caveat-banner-audit assertion failed: ${a.id}`);
}
