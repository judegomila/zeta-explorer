/**
 * @module imp-35662-eflow-fartail-remnant-limit-guard
 *
 * imp-35662 (accuracy, regression-guard): imp-35552 established the exact
 * cancellation-free far-tail E_flow remnant on the closed surrogate channel and
 * the q -> -1 product-decay LIMIT, but only the imp-35552 module carries the
 * embedded checks -- there is no DEDICATED standalone run-assertions guard that
 * recomputes the remnant from scratch and pins the anchor values and the leading
 * decay form. This import-light module INDEPENDENTLY re-derives the signed
 * cancellation-free remnant
 *
 *   remnant_signed(u) = (1 - log u)/(u (s+1)) + (c - log u)/(u (s+c))
 *                       + (1/(s+1) + 1/(s+c))/u,   s = u - log u,  c = log 2 pi
 *
 * (byte-faithful to imp-35552, no height-map swap, no zeros bundle) and asserts:
 *   (1) the imp-35413 rung remnant(1e26) = 0.000979 reproduces;
 *   (2) the imp-35535 endpoint remnant(1e200) = 3.5385e-5 reproduces;
 *   (3) the signed remnant is NEGATIVE at every rung (leading sign);
 *   (4) the leading form remnant_signed ~ -(2 log u - 3 - c)/u^2 holds, i.e. the
 *       ratio |remnant_signed| u^2/(2 log u - 3 - c) descends MONOTONICALLY to 1
 *       (reaching 1.0000000 by 10^(1e120));
 *   (5) the local product decay exponent q = d log P / d log u steepens toward the
 *       finite -1 limit (q ~ -0.739 at 1e200, -0.918 at 10^1e6, -0.996 at 10^1e120),
 *       staying strictly above -1;
 *   (6) the recompute matches the imp-35552 baked ladder / limit record.
 * So a silent drift of the closed-remnant channel or the q -> -1 reading is tripped
 * in the npm-run assertion sweep.
 *
 * THE IDENTICAL CLOSED CHANNEL (byte-faithful to imp-35552)
 * ---------------------------------------------------------
 * The remnant is the signed difference analytic - (d log eFlowWith / du) with the
 * leading -1 and 3/u terms cancelled algebraically, so it never subtracts two O(1)
 * quantities and stays exact to arbitrary depth (the reason it can reach N = 10^(1e120),
 * far past the ~1e300 point where the imp-35534 finite-difference remnant collapses to
 * floating-point noise). q is measured by the SAME relative central difference in the
 * log10 exponent (rel = 1e-4) as imp-35552.
 *
 * REGRESSION-GUARD ONLY; recomputes established measurement figures; changes no
 * bound; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0
 * untouched; no operator positivity; no RH verdict; NO QED; no refereed bound is changed.
 *
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (the closed remnant / q -> -1 limit pinned here)
 * @see imp-35535-eflow-fartail-remnant-product-decay-ladder (the remnant(1e200) = 3.5385e-5 endpoint anchor)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the remnant(1e26) = 0.000979 anchor)
 * @see imp-35659 (INDEPENDENT complex-step cross-check of the same remnant / leading sign)
 */

import { IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT } from './imp-35552-eflow-fartail-remnant-product-decay-limit.js';

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);
const C = LN2PI;

// The EXACT cancellation-free signed remnant on the closed surrogate channel
// (s = u - log u, c = log 2 pi), byte-faithful to imp-35552 remnantSignedClosed.
function remnantSigned(u) {
  const lu = Math.log(u);
  const s = u - lu;
  const t1 = (1 - lu) / (u * (s + 1));
  const t2 = (C - lu) / (u * (s + C));
  const AB = 1 / (s + 1) + 1 / (s + C);
  return t1 + t2 + AB / u;
}
function remnantClosedAtLog10(e) {
  return Math.abs(remnantSigned(e * Math.LN10));
}

// The product P(N) = remnant * log N (log N = u) and its local decay exponent q,
// by the SAME relative central difference in the log10 exponent as imp-35552.
function productAtLog10(e) {
  return remnantClosedAtLog10(e) * e * Math.LN10;
}
function productExponentAtLog10(e) {
  const rel = 1e-4;
  const eLo = e * (1 - rel);
  const eHi = e * (1 + rel);
  const uLo = eLo * Math.LN10;
  const uHi = eHi * Math.LN10;
  return (Math.log(productAtLog10(eHi)) - Math.log(productAtLog10(eLo))) /
    (Math.log(uHi) - Math.log(uLo));
}

// The leading closed form magnitude: remnant_signed ~ -(2 log u - 3 - c)/u^2.
function leadingForm(u) {
  return (2 * Math.log(u) - 3 - C) / (u * u);
}

// Independent anchor reproductions.
const R_ANCHOR_1E26 = remnantClosedAtLog10(26); // imp-35413 rung, ~9.7916e-4
const R_ANCHOR_1E200 = remnantClosedAtLog10(200); // imp-35535 endpoint, ~3.5385e-5

// The deep ladder (matches the imp-35552 LADDER log10N grid past 1e200).
const LADDER_LOG10N = [200, 1e3, 1e4, 1e6, 1e9, 1e12, 1e18, 1e30, 1e60, 1e120];

// Signed remnant is negative at every rung (the imp-35659-confirmed leading sign).
const SIGNED_ALL_NEGATIVE = LADDER_LOG10N.every((e) => remnantSigned(e * Math.LN10) < 0);

// The leading-form ratio |remnant_signed| u^2/(2 log u - 3 - c) descends monotonically
// to 1 (from above), i.e. the remnant is asymptotic to -(2 log u - 3 - c)/u^2.
const LEADING_RATIOS = LADDER_LOG10N.map((e) => {
  const u = e * Math.LN10;
  return Math.abs(remnantSigned(u)) / leadingForm(u);
});
const LEADING_RATIO_DESCENDS_TO_ONE = LEADING_RATIOS.every(
  (r, i) => (i === 0 || r <= LEADING_RATIOS[i - 1]) && r >= 1 - 1e-9,
);
const LEADING_RATIO_AT_1E120 = LEADING_RATIOS[LEADING_RATIOS.length - 1];

// q steepens monotonically toward -1 across the deep ladder and stays strictly above -1.
const Q_LADDER = LADDER_LOG10N.map((e) => productExponentAtLog10(e));
const Q_MONOTONE_TO_LIMIT = Q_LADDER.every(
  (q, i) => (i === 0 || q < Q_LADDER[i - 1]) && q > -1,
);
const Q_AT_1E200 = Q_LADDER[0];
const Q_AT_10P1E6 = productExponentAtLog10(1e6);
const Q_AT_10P1E120 = Q_LADDER[Q_LADDER.length - 1];

// The imp-35552 baked record for the reproduce cross-check (import-light, no zeros bundle).
const IMP35552 = IMP35552_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LIMIT;

export const IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD = {
  id: 'imp-35662',
  proofSection: 'S-frontier',
  question:
    'Pin the imp-35552 cancellation-free far-tail E_flow remnant and its q -> -1 product-decay ' +
    'limit against a silent drift: independently reproduce remnant(1e26) = 0.000979 and ' +
    'remnant(1e200) = 3.5385e-5, the negative leading sign, the -(2 log u - 3 - c)/u^2 leading ' +
    'form and the q -> -1 trend.',
  recompute: {
    anchor_remnant_1e26: +R_ANCHOR_1E26.toExponential(6),
    anchor_remnant_1e200: +R_ANCHOR_1E200.toExponential(6),
    leadingRatioAt1e120: +LEADING_RATIO_AT_1E120.toFixed(8),
    qAt1e200: +Q_AT_1E200.toFixed(6),
    qAt10p1e6: +Q_AT_10P1E6.toFixed(6),
    qAt10p1e120: +Q_AT_10P1E120.toFixed(6),
    qLimit: -1,
  },
  isRigorous: false,
  verdict:
    'REGRESSION-GUARD ONLY. An independent recompute of the imp-35552 cancellation-free closed ' +
    'remnant reproduces the imp-35413 rung remnant(1e26) = 0.000979 and the imp-35535 endpoint ' +
    'remnant(1e200) = 3.5385e-5 to storage precision, confirms the signed remnant is NEGATIVE at ' +
    'every rung, verifies the leading form remnant_signed ~ -(2 log u - 3 - c)/u^2 (ratio ' +
    '|remnant_signed| u^2/(2 log u - 3 - c) descends monotonically to 1.0000000 by 10^1e120) and ' +
    'the q -> -1 trend (q ~ -0.739 at 1e200, -0.918 at 10^1e6, -0.996 at 10^1e120, strictly above ' +
    '-1), matching the imp-35552 baked ladder / limit record. Recomputes established measurement ' +
    'figures; changes no bound; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-35552 (the closed remnant / q -> -1 limit pinned here); imp-35535 (remnant(1e200) = ' +
    '3.5385e-5 endpoint); imp-35413 (remnant(1e26) = 0.000979 anchor); imp-35659 (complex-step ' +
    'cross-check of the same remnant and negative leading sign); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD_ASSERTIONS = [
  {
    // Anchor: the closed remnant at N = 1e26 reproduces the imp-35413 rung 0.000979.
    id: 'imp35662-reproduces-imp35413-rung',
    description: 'the closed-channel remnant at N = 1e26 matches the imp-35413 rung 0.000979',
    holds: () => Math.abs(R_ANCHOR_1E26 - 0.000979) < 5e-6,
  },
  {
    // Anchor: the closed remnant at N = 1e200 reproduces the imp-35535 endpoint 3.5385e-5.
    id: 'imp35662-reproduces-imp35535-endpoint',
    description: 'the closed-channel remnant at N = 1e200 matches the imp-35535 endpoint 3.5385e-5',
    holds: () => Math.abs(R_ANCHOR_1E200 - 3.5385e-5) < 5e-9,
  },
  {
    // Leading sign: the signed remnant is negative at every rung (imp-35659-confirmed).
    id: 'imp35662-signed-remnant-negative',
    description: 'the signed remnant is negative at every deep-ladder rung',
    holds: () => SIGNED_ALL_NEGATIVE === true,
  },
  {
    // Leading form: |remnant_signed| u^2/(2 log u - 3 - c) descends monotonically to 1.
    id: 'imp35662-leading-form-ratio-to-one',
    description: 'the leading-form ratio descends monotonically to 1 (reaching 1.0000000 by 10^1e120)',
    holds: () =>
      LEADING_RATIO_DESCENDS_TO_ONE === true &&
      Math.abs(LEADING_RATIO_AT_1E120 - 1) < 1e-6,
  },
  {
    // q -> -1: q steepens monotonically across the deep ladder and stays strictly above -1.
    id: 'imp35662-q-monotone-to-finite-limit',
    description: 'q steepens monotonically toward -1 and stays strictly above -1',
    holds: () => Q_MONOTONE_TO_LIMIT === true,
  },
  {
    // q values reproduce the imp-35552 readings: -0.739 (1e200), -0.918 (10^1e6), -0.996 (10^1e120).
    id: 'imp35662-q-values-reproduce',
    description: 'q reproduces -0.738987 (1e200), -0.918243 (10^1e6), -0.996360 (10^1e120)',
    holds: () =>
      Math.abs(Q_AT_1E200 - -0.738987) < 5e-4 &&
      Math.abs(Q_AT_10P1E6 - -0.918243) < 5e-4 &&
      Math.abs(Q_AT_10P1E120 - -0.996360) < 5e-5,
  },
  {
    // Cross-check: the recompute matches the imp-35552 baked ladder / limit record.
    id: 'imp35662-agrees-with-imp35552-record',
    description: 'the recompute matches the imp-35552 baked ladder remnant and limit q readings',
    holds: () =>
      Math.abs(R_ANCHOR_1E200 - IMP35552.ladder[0].remnant) < 5e-9 &&
      Math.abs(Q_AT_1E200 - IMP35552.limit.qAt1e200) < 5e-4 &&
      Math.abs(Q_AT_10P1E120 - IMP35552.limit.qAt10p1e120) < 5e-5 &&
      IMP35552.limit.qLimit === -1,
  },
  {
    // Honesty gate: regression-guard only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35662-honesty-gate-no-qed',
    description: 'Regression-guard only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD.isRigorous === false &&
      /NO QED/.test(IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD.verdict) &&
      /refereed bound is changed/i.test(IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD.verdict),
  },
];

for (const a of IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35662-eflow-fartail-remnant-limit-guard assertion failed: ${a.id}`,
    );
  }
}

export default IMP35662_EFLOW_FARTAIL_REMNANT_LIMIT_GUARD;
