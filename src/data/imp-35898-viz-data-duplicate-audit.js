/**
 * @module imp-35898-viz-data-duplicate-audit
 *
 * imp-35898 (ux, S-frontier ticket audit): imp-35898 asked to "Add an import-light viz-data
 * module (baked literals, no heavy imports) for the imp-35852 adversarial-ordering summation
 * results: the five orderings (original, signedAsc, magAsc, magDesc, clustered) x three
 * schemes (naive, pairwise, Kahan) error grid at N=488602, contrasted against the imp-35761
 * coherent N*eps ceiling".
 *
 * Auditing src/data/ BEFORE writing a new module found the requested viz-data module ALREADY
 * EXISTS: imp-35935-adversarial-ordering-viz-data.js exports IMP35935_ORDERINGS, the exact
 * five orderings (original, signedAsc, magAsc, magDesc, clustered) x three schemes
 * (naive/pairwise/Kahan) baked-literal error grid at N=488602, plus IMP35935_CEILINGS carrying
 * the coherent N*eps ceiling (naiveCoherentLinear) and the log2(N)*eps pairwise ceiling for
 * direct contrast -- and it is registered/reachable at route /viz-imp35935-adversarial-ordering
 * in visualizations-index.js. imp-35898 is a DUPLICATE of work imp-35935 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module -- imp-35935 already supplies the five-ordering x three-scheme
 * grid and the ceiling contrast in full. No new claim; changes no bound; NO QED.
 *
 * @see imp-35935-adversarial-ordering-viz-data.js (the pre-existing viz-data module this duplicates)
 * @see imp-35852-w1-summation-adversarial-ordering.js (source measurement both tickets target)
 */

const REQUIRED_MODULE_EXPORT = 'IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA';
const REQUIRED_ORDERINGS = ['original', 'signedAsc', 'magAsc', 'magDesc', 'clustered'];
const REQUIRED_ROUTE = '/viz-imp35935-adversarial-ordering';
const REQUIRED_SOURCE_TICKET = 'imp-35852';

export const IMP35898_VIZ_DATA_DUPLICATE_AUDIT = {
  id: 'imp-35898',
  proofSection: 'S-frontier',
  question:
    'imp-35898 asked to add an import-light viz-data module for the imp-35852 five-ordering x ' +
    'three-scheme skeptical summation error grid at N=488602, contrasted against the ' +
    'imp-35761 coherent N*eps ceiling; audit whether such a module already exists before ' +
    'writing a duplicate.',
  finding:
    'DUPLICATE TICKET. src/data/imp-35935-adversarial-ordering-viz-data.js already exports ' +
    REQUIRED_MODULE_EXPORT +
    ', carrying the exact five orderings (' +
    REQUIRED_ORDERINGS.join(', ') +
    ') x three schemes (naive, pairwise, Kahan) baked-literal error grid sourced from ' +
    REQUIRED_SOURCE_TICKET +
    ', plus a ceilings object (naiveCoherentLinear = N*eps, pairwise = log2(N)*eps) for the ' +
    'exact contrast requested. The module is registered and reachable at route ' +
    REQUIRED_ROUTE +
    ' in visualizations-index.js.',
  duplicateOf: 'imp-35935 (the ticket that authored the existing viz-data module)',
  requiredModuleExport: REQUIRED_MODULE_EXPORT,
  requiredOrderings: REQUIRED_ORDERINGS,
  requiredRoute: REQUIRED_ROUTE,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module added -- imp-35935 already supplies the five-ordering ' +
    'x three-scheme error grid and the coherent-ceiling contrast in full. This module records ' +
    'the duplicate-ticket finding and pins a permanent regression guard confirming the existing ' +
    'viz-data module stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35898_VIZ_DATA_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35898-required-orderings-well-formed',
    description: 'The cited orderings list matches the five imp-35852 term orderings in order',
    holds: () =>
      IMP35898_VIZ_DATA_DUPLICATE_AUDIT.requiredOrderings.join(',') ===
      'original,signedAsc,magAsc,magDesc,clustered',
  },
  {
    id: 'imp35898-finding-cites-module-and-route',
    description: 'The audit finding quotes both the pre-existing export name and its registered route',
    holds: () =>
      IMP35898_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_MODULE_EXPORT) &&
      IMP35898_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_ROUTE),
  },
  {
    id: 'imp35898-finding-cites-source-ticket',
    description: 'The audit finding cites imp-35852 as the shared source measurement',
    holds: () => IMP35898_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_SOURCE_TICKET),
  },
  {
    id: 'imp35898-duplicate-of-imp-35935',
    description: 'The audit correctly attributes the pre-existing viz-data module to imp-35935',
    holds: () => IMP35898_VIZ_DATA_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35935'),
  },
  {
    id: 'imp35898-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35898_VIZ_DATA_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35898_VIZ_DATA_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35898_VIZ_DATA_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35898_VIZ_DATA_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35898-viz-data-duplicate-audit assertion failed: ${a.id}`);
  }
}
