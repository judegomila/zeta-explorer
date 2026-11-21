/**
 * @module imp-36037-clustered-order-shape-sweep-duplicate-audit
 *
 * imp-36037 (numerical, S-frontier ticket audit): imp-36037 asked to "Sweep the full
 * imp-35893 seven-shape pairing-tree family under the fixed imp-35852 CLUSTERED worst term
 * ORDER at N ~ 488602 (exact-BigInt reference) to locate the genuine worst shape-by-order
 * combination and quantify how close it approaches the log2(N)*eps ceiling", motivated by
 * imp-35973 finding crossCatL (~4.12e-1 of the ceiling) exceeds the CROSS caterpillarR
 * configuration (~1.03e-1) -- i.e. a worst-SHAPE flip under the hostile ORDER it never swept
 * the full shape family for.
 *
 * Auditing existing modules BEFORE writing a new sweep found this ALREADY DELIVERED:
 * imp-36020-w1-clustered-order-shape-argmax.js is exactly this seven-shape sweep. It re-sums
 * the fixed imp-35812 N ~ 488602 oscillatory multiset under the imp-35852 clustered same-sign
 * ORDER through every one of the seven imp-35893 pairing-tree SHAPES (balanced midpoint, four
 * skew-fraction splits, left/right caterpillar) against the SAME order- and
 * association-invariant exact 2^{-96} dyadic-BigInt reference, and pins caterpillarL as the
 * arg-max (~1.7305e-15, ~41.2% of the log2(N)*eps ceiling) -- ~4.0x the caterpillarR
 * cross-term (~1.03e-1) and ~55x the shallow-tree order-only worst (~7.5e-3), with the
 * ordering NON-MONOTONE in depth. imp-36037 is a DUPLICATE ticket the anti-starvation
 * frontier scout re-seeded from the same imp-35973 gap description before (or concurrently
 * with) imp-36020 landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new sweep -- imp-36020 already supplies the full seven-shape clustered-order
 * measurement and the caterpillarL arg-max. No new numerics; no new claim; changes no bound;
 * NO QED. This module imports the pre-existing imp-36020 export and pins a permanent
 * regression guard that the imp-36037-requested sweep (all seven shapes, caterpillarL
 * arg-max, ceiling fraction ~41%, ceiling still NOT attained) stays delivered and does not
 * silently regress.
 *
 * @see imp-36020-w1-clustered-order-shape-argmax (the pre-existing seven-shape sweep this audit confirms)
 * @see imp-35973-w1-summation-order-shape-cross-term (source: the crossCatL flip imp-36037 restates)
 * @see imp-35893-w1-summation-pairwise-tree-shape (the seven pairing-tree SHAPES both tickets sweep)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered worst term ORDER both tickets fix)
 * @see imp-35981-pairwise-shape-honest-status-duplicate-audit (sibling duplicate-ticket audit pattern)
 */

import {
  IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX,
} from './imp-36020-w1-clustered-order-shape-argmax.js';

const SWEEP = IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX;

export const IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT = {
  id: 'imp-36037',
  proofSection: 'S-frontier',
  question:
    'imp-36037 asked to sweep the full imp-35893 seven-shape pairing-tree family under the ' +
    'fixed imp-35852 clustered worst term ORDER at N ~ 488602 (exact-BigInt reference) to ' +
    'locate the genuine worst shape-by-order combination and quantify how close it approaches ' +
    'the log2(N)*eps ceiling; audit whether that sweep already exists before running a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-36020-w1-clustered-order-shape-argmax.js already is exactly this ' +
    'seven-shape sweep: it re-sums the fixed N ~ 488602 multiset under the clustered same-sign ' +
    'ORDER through all seven imp-35893 SHAPES against the same order/association-invariant exact ' +
    '2^{-96} BigInt reference and pins caterpillarL as the arg-max (~1.7305e-15, ~41.2% of the ' +
    'log2(N)*eps ceiling), ~4.0x the caterpillarR cross-term and ~55x the shallow-tree order-only ' +
    'worst -- verbatim the imp-36037 request.',
  duplicateOf: 'imp-36020 (the ticket that authored the pre-existing seven-shape clustered-order sweep)',
  deliveredArgMaxShape: SWEEP.summary.argMaxShape,
  deliveredArgMaxRatioToCeiling: SWEEP.summary.argMaxRatioToCeiling,
  deliveredShapeCount: SWEEP.shapes.length,
  deliveredVerdict: SWEEP.verdict,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new sweep run -- imp-36020 already supplies the full seven-shape ' +
    'clustered-order measurement and the caterpillarL arg-max (~41.2% of the log2(N)*eps ' +
    'ceiling, still ~2.4x BELOW it). This module records the duplicate-ticket finding and pins ' +
    'a permanent regression guard confirming the delivered sweep stays present and consistent. ' +
    'Measurement/presentation-only; certifies no W1 bound; instantiates no interval; changes no ' +
    'bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

export const IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp36037-sweep-exists',
    description: 'The pre-existing imp-36020 seven-shape clustered-order sweep is importable and non-empty',
    holds: () =>
      !!SWEEP && Array.isArray(SWEEP.shapes) && SWEEP.shapes.length === 7 &&
      typeof SWEEP.verdict === 'string' && SWEEP.verdict.length > 0,
  },
  {
    id: 'imp36037-sweep-is-caterpillarL-argmax',
    description: 'The delivered sweep pins caterpillarL as the arg-max shape under the clustered order',
    holds: () => SWEEP.summary.argMaxShape === 'caterpillarL',
  },
  {
    id: 'imp36037-argmax-ceiling-fraction-41pct',
    description: 'The delivered arg-max reaches ~41% of the log2(N)*eps ceiling (in [0.35, 0.50])',
    holds: () =>
      SWEEP.summary.argMaxRatioToCeiling > 0.35 && SWEEP.summary.argMaxRatioToCeiling < 0.5,
  },
  {
    id: 'imp36037-ceiling-still-not-attained',
    description: 'Even the delivered arg-max stays below the log2(N)*eps ceiling (ratio < 1)',
    holds: () => SWEEP.shapes.every((r) => r.ratioToPairwiseCeiling < 1 && r.combinedNormErr > 0),
  },
  {
    id: 'imp36037-duplicate-of-imp-36020',
    description: 'The audit correctly attributes the pre-existing sweep to imp-36020',
    holds: () => IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-36020'),
  },
  {
    id: 'imp36037-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT.isRigorous === false &&
      /GREENFIELD/.test(IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT.verdict) &&
      /NO QED/.test(IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP36037_CLUSTERED_ORDER_SHAPE_SWEEP_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36037-clustered-order-shape-sweep-duplicate-audit assertion failed: ${a.id}`);
  }
}
