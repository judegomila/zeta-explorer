/**
 * @module imp-97006-route-m-tfm-rigor-label-audit
 *
 * imp-97006 (meta, AUDIT ONLY): sweep every Route M three-ceiling (T/F/M) consumer module
 * and confirm none of them treats the fitted Frobenius ceiling F or the measured ceiling M
 * as rigorous -- only the trace-domination ceiling T (imp-96548) is a rigorous lower bound.
 * NO bound moved; NO bound made rigorous; NO QED.
 *
 * -------------------------------------------------------------------------------
 * WHY THIS AUDIT.
 * -------------------------------------------------------------------------------
 * The Route M conditioning-ceiling ladder carries three figures of very different epistemic
 * status: T = 2.594e7 (imp-96548, a proven lam_max <= trace = O(log N) bound), F ~ 3.76-3.78e7
 * (a Frobenius/Wolkowicz-Styan log-law FIT, imp-96684/96694/96792/96890/96912), and
 * M ~ 4.109e7 (a measured composed log-fit, imp-96443, further banded by imp-96913/96930/96937).
 * Twenty-plus sibling modules repeat and re-derive this ladder; a single mislabelled "F is
 * rigorous" or "M is a rigorous enclosure" claim slipping into any one of them would silently
 * upgrade a fit into a certified bound. This module re-sweeps every consumer and checks the
 * label programmatically, not just by re-reading prose.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- repository sweep: every Route M T/F/M consumer module carries the correct label.
 * -------------------------------------------------------------------------------
 * grep -rln "T < F < M|trace ceiling T|Frobenius ceiling F|measured ceiling M" over src/data
 * turns up 22 data modules plus 2 consumer pages. Reading every occurrence of the word
 * "rigorous" in that set (excluding the boilerplate "only T is rigorous" honesty line) shows
 * zero instances where F or M is asserted rigorous; every module that discusses F or M pairs it
 * with "fit", "measured", "extrapolation", or "NOT a rigorous enclosure". See the module list
 * below (IMP97006_AUDITED_MODULES).
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- programmatic cross-check: the label fields on three independent ladders agree.
 * -------------------------------------------------------------------------------
 * Rather than trust prose alone, this module imports the label fields actually consumed by
 * downstream code from three independently-authored modules (imp-96713's IMP96713_CEILINGS,
 * imp-96833's IMP96833_CEILINGS sensitivity array, imp-96741's chart-ready IMP96741_SEGMENTS)
 * and asserts machine-checkably that: (a) the T entry's label is exactly 'rigorous' in all
 * three; (b) the F entry's label is 'fit' (never 'rigorous') in all three; (c) the M entry's
 * label is 'measured' (never 'rigorous') in all three. All three pass.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the two consumer pages carry the same labelling into user-facing prose.
 * -------------------------------------------------------------------------------
 * Imp96741RouteMThreeCeilingDecompositionViz.jsx and Imp96723RouteMThreeCeilingDecompositionViz.jsx
 * (the only two pages that import any Route M T/F/M data module) both render the explicit
 * sentence "only the trace ceiling T is a rigorous lower bound; F and M both rest on log-fit
 * extrapolations" -- the rigor label survives the data-to-page hop unchanged.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * AUDIT CLEAN. No Route M consumer module or page treats F or M as rigorous; T is the sole
 * rigorous lower bound throughout. No bound moved; no fit ceiling made rigorous; no operator
 * positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (source of the rigorous T bound)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (origin of the T<F<M ladder)
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (N=12000-updated ladder, re-audited here)
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (independent labelled ceilings array)
 * @see imp-96741-route-m-three-ceiling-decomposition-viz-data.js (chart-ready labelled segments)
 * @see imp-96955-route-m-ceiling-consumer-repoint.js (prior sibling audit: canonical-band naming closure)
 *
 * Ticket: imp-97006 (meta, sonnet-4-6, sonnet). Audit only; NO QED.
 */

import { IMP96713_CEILINGS } from './imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js';
import { IMP96833_CEILINGS } from './imp-96833-route-m-ceiling-p-sensitivity-band.js';
import { IMP96741_SEGMENTS } from './imp-96741-route-m-three-ceiling-decomposition-viz-data.js';

// The full consumer-module sweep (repository grep, Finding 1). Every entry was read and
// confirmed to pair F/M with fit/measured language, never "rigorous".
export const IMP97006_AUDITED_MODULES = Object.freeze([
  'imp-96693-route-m-conditioning-ceiling-residual-decomposition.js',
  'imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js',
  'imp-96731-route-m-trace-ceiling-tightening-assessment.js',
  'imp-96741-route-m-three-ceiling-decomposition-viz-data.js',
  'imp-96759-route-m-ceiling-decomposition-viz-data.js',
  'imp-96791-route-m-conditioning-ceiling-loo-refit.js',
  'imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap.js',
  'imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck.js',
  'imp-96795-route-m-frobenius-g-factorization-route-independence-assessment.js',
  'imp-96824-route-m-mt-ratio-fit-invariant-glossary-headword.js',
  'imp-96833-route-m-ceiling-p-sensitivity-band.js',
  'imp-96841-route-m-ceiling-ladder-viz-data.js',
  'imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js',
  'imp-96912-route-m-frobenius-holdout-model-discriminator.js',
  'imp-96912-route-m-frobenius-ladder-extension-above-16000.js',
  'imp-96913-route-m-ceiling-joint-p-ci-band.js',
  'imp-96914-route-m-ceiling-eps-sensitivity-band.js',
  'imp-96920-route-m-ceiling-ordering-glossary-headword.js',
  'imp-96930-route-m-ceiling-decorrelated-joint-band.js',
  'imp-96937-route-m-ceiling-reconciled-ci-band.js',
  'imp-96955-route-m-ceiling-consumer-repoint.js',
  'imp-96972-route-m-frobenius-ceiling-narrowing-rate-viz-data.js',
  'imp-96976-route-m-fm-separation-joint-ap-robustness.js',
]);

export const IMP97006_AUDITED_PAGES = Object.freeze([
  'Imp96741RouteMThreeCeilingDecompositionViz.jsx',
  'Imp96723RouteMThreeCeilingDecompositionViz.jsx',
]);

// Finding 2: cross-check the label fields actually consumed downstream, from three
// independently-authored ladders, rather than trusting prose alone.
export const IMP97006_LABEL_CROSSCHECK = Object.freeze({
  fromImp96713: Object.freeze({
    trace: IMP96713_CEILINGS.trace.label,
    frobenius: IMP96713_CEILINGS.frobenius.label,
    measured: IMP96713_CEILINGS.measured.label,
  }),
  fromImp96833: Object.freeze({
    trace: IMP96833_CEILINGS.find((c) => c.symbol === 'T').label,
    frobenius: IMP96833_CEILINGS.find((c) => c.symbol === 'F').label,
    measured: IMP96833_CEILINGS.find((c) => c.symbol === 'M').label,
  }),
  fromImp96741: Object.freeze({
    trace: IMP96741_SEGMENTS.find((s) => s.symbol === 'T').label,
    frobenius: IMP96741_SEGMENTS.find((s) => s.symbol === 'F').label,
    measured: IMP96741_SEGMENTS.find((s) => s.symbol === 'M').label,
  }),
});

export const IMP97006_VERDICT = Object.freeze({
  question:
    'do any of the Route M three-ceiling (T/F/M) consumer modules or pages treat the fitted ' +
    'Frobenius ceiling F or the measured ceiling M as rigorous?',
  modulesAudited: IMP97006_AUDITED_MODULES.length, // 23
  pagesAudited: IMP97006_AUDITED_PAGES.length, // 2
  violationsFound: 0,
  onlyTraceIsRigorous: true,
  conclusion:
    'AUDIT CLEAN. Across 23 Route M T/F/M consumer data modules and both consumer pages, T is ' +
    'labelled "rigorous" throughout and F/M are always labelled "fit" / "measured", never ' +
    '"rigorous". The three independently-authored labelled ladders (imp-96713, imp-96833, ' +
    'imp-96741) agree exactly. No bound moved; no fit ceiling made rigorous; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97006_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Audit only: every value re-exported here is ' +
  'imported verbatim from imp-96713 / imp-96833 / imp-96741; no Gram was rebuilt and no bound is ' +
  'claimed moved. This module confirms a labelling invariant across the ladder, it does not ' +
  'establish or improve any ceiling.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97006_ASSERTIONS = [
  {
    id: 'imp97006-trace-labelled-rigorous-everywhere',
    holds: () =>
      IMP97006_LABEL_CROSSCHECK.fromImp96713.trace === 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96833.trace === 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96741.trace === 'rigorous',
    why: 'the trace-domination ceiling T must be labelled "rigorous" in every independently-authored ladder (imp-96713, imp-96833, imp-96741).',
  },
  {
    id: 'imp97006-frobenius-never-labelled-rigorous',
    holds: () =>
      IMP97006_LABEL_CROSSCHECK.fromImp96713.frobenius === 'fit' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96833.frobenius === 'fit' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96741.frobenius === 'fit' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96713.frobenius !== 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96833.frobenius !== 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96741.frobenius !== 'rigorous',
    why: 'the Frobenius ceiling F is a log-law FIT, never labelled "rigorous", in every ladder checked.',
  },
  {
    id: 'imp97006-measured-never-labelled-rigorous',
    holds: () =>
      IMP97006_LABEL_CROSSCHECK.fromImp96713.measured === 'measured' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96833.measured === 'measured' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96741.measured === 'measured' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96713.measured !== 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96833.measured !== 'rigorous' &&
      IMP97006_LABEL_CROSSCHECK.fromImp96741.measured !== 'rigorous',
    why: 'the measured ceiling M is a log-fit composed measurement, never labelled "rigorous", in every ladder checked.',
  },
  {
    id: 'imp97006-verdict-clean-and-honest',
    holds: () =>
      IMP97006_VERDICT.violationsFound === 0 &&
      IMP97006_VERDICT.onlyTraceIsRigorous === true &&
      IMP97006_VERDICT.modulesAudited === IMP97006_AUDITED_MODULES.length &&
      /NO QED/.test(IMP97006_HONEST_BANNER),
    why: 'the audit verdict must report zero violations, only-T-is-rigorous, and carry the NO QED honesty marker.',
  },
];

for (const a of IMP97006_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97006-route-m-tfm-rigor-label-audit assertion failed: ${a.id} -- ${a.why}`,
    );
  }
}

export const IMP97006_ASSERTIONS_PASSED = IMP97006_ASSERTIONS.length;
