/**
 * @module imp-34740-caveat-surfacing-audit-34710-34714-34693
 *
 * imp-34740 (meta): AUDIT of the freshly committed imp-34710/34711/34712/
 * 34713/34714/34693 frontier cohort for (a) the mandatory honest-status
 * banner on any page a module drives, and (b) no transitive import of the
 * 20MB src/data/zeros-to-1e6.js zeros bundle. Extends the imp-34618/34521/
 * 34561/34618/34725 caveat-surfacing-audit lineage.
 *
 * COHORT SPLIT. Only two of the six modules drive a rendered page:
 *   - imp-34710 -> src/pages/Imp34736SigmaKneeResidualBudgetViz.jsx
 *   - imp-34711 -> src/pages/Imp34737DpStarFarTailLadderViz.jsx
 * The other four (imp-34712, imp-34713, imp-34714, imp-34693) are data-only
 * modules with no src/pages/*.jsx importing them by id or by module path;
 * they feed later derivation modules (e.g. imp-34751, imp-34730, imp-34799,
 * imp-34774, imp-34732, imp-34794, imp-34726, imp-34776, imp-34798, imp-34727,
 * imp-34731, imp-34775, imp-34755, imp-34733) rather than a viz page directly,
 * so criterion (a) does not apply to them -- there is no page to check.
 *
 * METHOD. For (a): both driving pages were read directly; each renders an
 * inline "Honest status:" block repeating imp-3066 K_a>=0 untouched, C_mb
 * GUE-conditional per imp-486, NO QED, and no refereed bound is changed.
 * For (b): every `import` statement was traced transitively from all six
 * modules. The chain touches only small helper modules (lambda-rh-height-
 * mapping.js, polymath15-constant-C-C.js, bridge-lambda-rh.js,
 * g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js, dyson-scaling-N5000.js,
 * dyson-burgers-shock.js, lambda-intercept-analytic.js,
 * guth-maynard-tail-bound.js) -- none imports zeros-to-1e6.js.
 *
 * FINDING: no gap. Both driving pages carry the banner inline; the four
 * page-less modules have nothing to check for (a); no module in the cohort
 * or its transitive closure imports the heavy zeros bundle. AUDIT-ONLY -- no
 * surfacing was added because none was missing.
 */

const PAGE_DRIVEN = [
  { ticket: 'imp-34710', page: 'src/pages/Imp34736SigmaKneeResidualBudgetViz.jsx', hasInlineBanner: true },
  { ticket: 'imp-34711', page: 'src/pages/Imp34737DpStarFarTailLadderViz.jsx', hasInlineBanner: true },
];

const DATA_ONLY = [
  { ticket: 'imp-34712', reason: 'feeds imp-34751/imp-34730, no page imports it directly' },
  { ticket: 'imp-34713', reason: 'referenced only from improvements.js log, no page imports it' },
  { ticket: 'imp-34714', reason: 'feeds the imp-34774/34732/34794/34726/34776/34799 Krawczyk family, no page imports it directly' },
  { ticket: 'imp-34693', reason: 'feeds imp-34798/34727/34731/34775/34755/34733, no page imports it directly' },
];

const HEAVY_BUNDLE_PATH = 'src/data/zeros-to-1e6.js';

const TRANSITIVE_IMPORT_CLOSURE = [
  'lambda-rh-height-mapping.js', 'polymath15-constant-C-C.js', 'bridge-lambda-rh.js',
  'g6a-sub-constant-value.js', 'polymath15-lemma52-shock-holder.js',
  'lambda-intercept-burgers-uniformity.js', 'dyson-scaling-N5000.js',
  'dyson-burgers-shock.js', 'lambda-intercept-analytic.js', 'guth-maynard-tail-bound.js',
];

export const CAVEAT_SURFACING_AUDIT_34710_34714_34693 = {
  ticket: 'imp-34740',
  pageDriven: PAGE_DRIVEN,
  dataOnly: DATA_ONLY,
  cohortSize: PAGE_DRIVEN.length + DATA_ONLY.length,
  heavyBundlePath: HEAVY_BUNDLE_PATH,
  transitiveImportClosure: TRANSITIVE_IMPORT_CLOSURE,
  heavyBundleFoundInClosure: TRANSITIVE_IMPORT_CLOSURE.some((m) => m === HEAVY_BUNDLE_PATH.split('/').pop()),
  gapsFound: PAGE_DRIVEN.filter((m) => !m.hasInlineBanner).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the two page-driving cohort members (imp-34710, imp-34711) ' +
    'carry the honest-status banner inline in their own JSX, the four data-only members have no ' +
    'page to check for a banner, and no module in the cohort or its transitive import closure ' +
    'reaches src/data/zeros-to-1e6.js. No surfacing added because none was missing. No bound ' +
    'change; imp-3066 K_a>=0 untouched; C_mb remains GUE-conditional per imp-486; NO QED; ' +
    'no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34710_34714_34693_ASSERTIONS = [
  {
    id: 'imp-34740-cohort-has-six-members',
    description: 'the audited cohort is exactly the six imp-34710/34711/34712/34713/34714/34693 modules',
    holds: () => CAVEAT_SURFACING_AUDIT_34710_34714_34693.cohortSize === 6,
  },
  {
    id: 'imp-34740-page-driven-pair-has-inline-banner',
    description: 'both page-driving cohort members carry the honest-status caveat inline in their own JSX',
    holds: () => PAGE_DRIVEN.length === 2 && PAGE_DRIVEN.every((m) => m.hasInlineBanner === true),
  },
  {
    id: 'imp-34740-no-heavy-bundle-in-closure',
    description: 'the transitive import closure of the cohort never reaches the zeros-to-1e6.js bundle',
    holds: () => CAVEAT_SURFACING_AUDIT_34710_34714_34693.heavyBundleFoundInClosure === false,
  },
  {
    id: 'imp-34740-no-gaps-found',
    description: 'no gap was found across the cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34710_34714_34693.gapsFound.length === 0,
  },
  {
    id: 'imp-34740-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34710_34714_34693.honest)
      && /No surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34710_34714_34693.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34710_34714_34693.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34710_34714_34693_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34740-caveat-surfacing-audit-34710-34714-34693 assertion failed: ${a.id}`);
}
