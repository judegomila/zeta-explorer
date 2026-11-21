/**
 * @module imp-35564-eflow-fartail-product-decay-viz-data
 * @fileoverview imp-35564 -- VIZ DATA ONLY for the imp-35535 E_flow far-tail
 *   fd-vs-analytic remnant*log N PRODUCT decay ladder (N = 1e26..1e200 on the
 *   closed surrogate channel): re-exports the imp-35535 ladder rows (log10N,
 *   remnant, product, productExponent) so a page can plot both the product
 *   P(N) falling monotonically (0.058620 -> 0.016296) and the local decay
 *   exponent q = d log P / d log x steepening monotonically away from zero
 *   (-0.435 -> -0.740) -- neither series had a page before this ticket.
 *
 *   Re-exports the imp-35535 ladder verbatim (that module is import-light:
 *   pure Math, no heavy dependency, never the 16.7MB zeros bundle), per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35535-eflow-fartail-remnant-product-decay-ladder.js (the ladder this re-exports)
 *   @see imp-35552-eflow-fartail-remnant-product-decay-limit.js (q's limiting value -1 past N=1e200)
 *
 *   Ticket: imp-35564 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. NO QED. No refereed bound is changed.
 */

import IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER from './imp-35535-eflow-fartail-remnant-product-decay-ladder.js';

export const IMP35564_LADDER = IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER.ladder;

export const IMP35564_PRODUCT = IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER.product;

export const IMP35564_SUMMARY = Object.freeze({
  rungCount: IMP35564_LADDER.length,
  productAt1e26: IMP35564_PRODUCT.at1e26,
  productAt1e200: IMP35564_PRODUCT.at1e200,
  dropFactor: IMP35564_PRODUCT.dropFactor1e26to1e200,
  qAt1e26: IMP35564_PRODUCT.exponentAt1e26,
  qAt1e200: IMP35564_PRODUCT.exponentAt1e200,
});

export default Object.freeze({
  id: 'imp-35564-eflow-fartail-product-decay-viz-data',
  ticket: 'imp-35564',
  sources: ['imp-35535-eflow-fartail-remnant-product-decay-ladder.js'],
  rows: IMP35564_LADDER,
  product: IMP35564_PRODUCT,
  summary: IMP35564_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35564_ASSERTIONS = [
  {
    id: 'imp35564-fourteen-rungs-present',
    holds: () => IMP35564_LADDER.length === 14,
    why: 'The ladder must cover all 14 imp-35535 rungs from N=1e26 to N=1e200.',
  },
  {
    id: 'imp35564-product-monotone-down',
    holds: () =>
      IMP35564_LADDER.every((row, i) => i === 0 || row.product < IMP35564_LADDER[i - 1].product),
    why: 'The product must fall monotonically at every rung, matching the imp-35535 finding.',
  },
  {
    id: 'imp35564-q-steepens-monotone-and-negative',
    holds: () =>
      IMP35564_LADDER.every((row) => row.productExponent < 0) &&
      IMP35564_LADDER.every(
        (row, i) => i === 0 || row.productExponent < IMP35564_LADDER[i - 1].productExponent,
      ),
    why: 'q must be negative at every rung and steepen monotonically, matching the imp-35535 finding.',
  },
  {
    id: 'imp35564-endpoints-match-imp35535',
    holds: () =>
      Math.abs(IMP35564_SUMMARY.qAt1e26 - -0.435) < 5e-3 &&
      Math.abs(IMP35564_SUMMARY.qAt1e200 - -0.740) < 5e-3,
    why: 'The head/tail q values must reproduce the imp-35535 headline -0.435 -> -0.740 steepening.',
  },
];

for (const assertion of IMP35564_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35564-eflow-fartail-product-decay-viz-data assertion failed: ${assertion.id}`);
  }
}
