/**
 * @module imp-35619-eflow-fartail-remnant-span-ladder-assertion
 *
 * imp-35619 (accuracy, regression-guard): imp-35553 baked the four-threshold
 * E_flow far-tail remnant crossing ladder (log10 N and decade spans through the
 * sub-1e-6 direct bisection at 10^1467.7351) plus the two span ratios, and
 * reproduced the imp-35413 remnant(1e26) = 0.000979 and imp-35473 sub-1e-4
 * (109.1892) anchors -- but those ladder literals live only inside the imp-35553
 * module and have no DEDICATED standalone run-assertions guard that recomputes
 * them from scratch. This import-light module INDEPENDENTLY recomputes the whole
 * ladder via the imp-35534 log-space identity (byte-faithful, no height-map swap,
 * no zeros bundle) and asserts the four log10 N crossings, the three decade spans,
 * the two span ratios and the two anchor reproductions to the recorded
 * printed-digit tolerance, so a silent drift of the eFlowWith/localExponent/remnant
 * channel is tripped in the npm-run assertion sweep.
 *
 * THE IDENTICAL LOG-SPACE CHANNEL (byte-faithful to imp-35534/imp-35553)
 * ---------------------------------------------------------------------
 * The sub-1e-6 crossing lands at N ~ 10^1467, far past the IEEE-754 double range,
 * so the remnant is evaluated in log-space on u = log N via the closed identity
 *
 *   log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP,
 *   g = log T0 = log(2 pi) + u - log(u),   C_F = (u - log(u) + 1)/(2 pi),
 *
 * which never forms the overflowing N or T0. localExponent is the same central
 * log-log difference (multiplicative h = 1.0002 in N), and the remnant is
 * |(-1 + 3/u) - localExponent|, byte-identical to imp-35473/imp-35534/imp-35553.
 *
 * THE PINNED LADDER (independently recomputed here, matched vs imp-35553 literals)
 * ------------------------------------------------------------------------------
 *   threshold   crossing log10 N    span to shed this decade    span ratio
 *   1e-3        25.6205             --                          --
 *   1e-4        109.1892            83.5687                     --
 *   1e-5        410.0475            300.8583                    3.6001
 *   1e-6        1467.7351 (direct)  1057.6875 (direct)          3.5156
 *   anchor: remnant(1e26) = 0.000979 (imp-35413 rung), sub-1e-4 = 109.1892 (imp-35473)
 *
 * REGRESSION-GUARD ONLY; recomputes established measurement figures; changes no
 * bound; far-tail E_coll exponent 1/2 per imp-3463; E_flow > 0 strictness
 * (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35553-eflow-fartail-remnant-decade-span-growth-fit (the ladder pinned here)
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the log-space channel origin)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the sub-1e-4 anchor 109.1892)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the remnant(1e26) = 0.000979 anchor)
 */

import { IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT } from './imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js';

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact A1-trap Gronwall exponent (log GRONWALL = TC_A1_TRAP).
const TC_A1_TRAP = 2.37e-4;
// Same central-difference step as imp-35135/imp-35473/imp-35534/imp-35553.
const H_LOG = Math.log(1.0002);

// EXACT log of the far-tail E_flow quantity, in log-space on u = log N (no overflow).
function lnEFlowByLogN(u) {
  const g = LN2PI + u - Math.log(u);
  const lnCF = Math.log((u - Math.log(u) + 1) / TWO_PI);
  return lnCF + Math.log(g) - g + TC_A1_TRAP;
}

// Local log-log decay exponent by the SAME central difference, evaluated in log-space.
function localExponentByLogN(u) {
  return (lnEFlowByLogN(u + H_LOG) - lnEFlowByLogN(u - H_LOG)) / (2 * H_LOG);
}

// The imp-35198 analytic leading closed form -1 + 3/log N.
function analyticSurrogateExponent(u) {
  return -1 + 3 / u;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (imp-35473/imp-35534 quantity).
function remnantAtLog10(e) {
  const u = e * Math.LN10;
  return Math.abs(analyticSurrogateExponent(u) - localExponentByLogN(u));
}

// Bisect the crossing at threshold thr in log10 N over a straddling bracket (remnant monotone).
function crossingLog10(thr, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > thr) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Independent recompute of the four crossings, three spans and two ratios.
const R_CROSS_1E3 = crossingLog10(1e-3, 20, 40);
const R_CROSS_1E4 = crossingLog10(1e-4, 100, 120);
const R_CROSS_1E5 = crossingLog10(1e-5, 400, 500);
const R_CROSS_1E6 = crossingLog10(1e-6, 1400, 1500);
const R_SPAN_34 = R_CROSS_1E4 - R_CROSS_1E3;
const R_SPAN_45 = R_CROSS_1E5 - R_CROSS_1E4;
const R_SPAN_56 = R_CROSS_1E6 - R_CROSS_1E5;
const R_RATIO_4534 = R_SPAN_45 / R_SPAN_34;
const R_RATIO_5645 = R_SPAN_56 / R_SPAN_45;
const R_ANCHOR_1E26 = remnantAtLog10(26);

// The imp-35553 baked ladder for the reproduce cross-check (import-light record, no zeros bundle).
const LADDER = IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.spanLadder;

export const IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION = {
  id: 'imp-35619',
  proofSection: 'S-frontier',
  question:
    'Pin the imp-35553 E_flow far-tail remnant span-growth ladder (four crossing log10 N, ' +
    'three decade spans, two span ratios) plus the imp-35413/imp-35473 anchors against a ' +
    'silent drift of the imp-35534 log-space fd-vs-analytic remnant channel.',
  recompute: {
    cross_1e3: +R_CROSS_1E3.toFixed(4),
    cross_1e4: +R_CROSS_1E4.toFixed(4),
    cross_1e5: +R_CROSS_1E5.toFixed(4),
    cross_1e6: +R_CROSS_1E6.toFixed(4),
    span_34: +R_SPAN_34.toFixed(4),
    span_45: +R_SPAN_45.toFixed(4),
    span_56: +R_SPAN_56.toFixed(4),
    ratio_4534: +R_RATIO_4534.toFixed(4),
    ratio_5645: +R_RATIO_5645.toFixed(4),
    anchor_remnant_1e26: +R_ANCHOR_1E26.toFixed(6),
  },
  isRigorous: false,
  verdict:
    'REGRESSION-GUARD ONLY. An independent log-space recompute of the imp-35534 ' +
    'fd-vs-analytic remnant channel reproduces the imp-35553 ladder to the printed digits: ' +
    'crossings 25.6205 / 109.1892 / 410.0475 / 1467.7351, spans 83.5687 / 300.8583 / ' +
    '1057.6875, ratios 3.6001 / 3.5156, plus the imp-35413 remnant(1e26) = 0.000979 and ' +
    'imp-35473 sub-1e-4 = 109.1892 anchors. Recomputes established measurement figures; ' +
    'changes no bound; E_coll far-tail exponent 1/2 per imp-3463; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; NO QED; no refereed bound is changed.',
  citation:
    'imp-35553 (the span-growth ladder pinned here); imp-35534 (log-space channel origin, ' +
    'sub-1e-5 410.0475); imp-35473 (sub-1e-4 anchor 109.1892); imp-35413 (remnant(1e26) = ' +
    '0.000979 anchor); imp-35198 (analytic -1 + 3/log N); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION_ASSERTIONS = [
  {
    // The four log10 N crossings reproduce the imp-35553 ladder to printed-digit tolerance.
    id: 'imp35619-four-crossings-match',
    description: 'the four crossings reproduce 25.6205 / 109.1892 / 410.0475 / 1467.7351',
    holds: () =>
      Math.abs(R_CROSS_1E3 - 25.6205) < 1e-3 &&
      Math.abs(R_CROSS_1E4 - 109.1892) < 1e-3 &&
      Math.abs(R_CROSS_1E5 - 410.0475) < 1e-3 &&
      Math.abs(R_CROSS_1E6 - 1467.7351) < 1e-2,
  },
  {
    // The three decade spans reproduce the imp-35553 ladder to printed-digit tolerance.
    id: 'imp35619-three-spans-match',
    description: 'the three decade spans reproduce 83.5687 / 300.8583 / 1057.6875',
    holds: () =>
      Math.abs(R_SPAN_34 - 83.5687) < 1e-3 &&
      Math.abs(R_SPAN_45 - 300.8583) < 1e-3 &&
      Math.abs(R_SPAN_56 - 1057.6875) < 1e-2,
  },
  {
    // The two span ratios reproduce the imp-35553 ladder to printed-digit tolerance.
    id: 'imp35619-two-ratios-match',
    description: 'the two span ratios reproduce 3.6001 (45/34) and 3.5156 (56/45)',
    holds: () =>
      Math.abs(R_RATIO_4534 - 3.6001) < 1e-3 &&
      Math.abs(R_RATIO_5645 - 3.5156) < 1e-3,
  },
  {
    // The two anchors reproduce: remnant(1e26) = 0.000979 and sub-1e-4 crossing 109.1892.
    id: 'imp35619-two-anchors-reproduce',
    description: 'the imp-35413 remnant(1e26) = 0.000979 and imp-35473 sub-1e-4 109.1892 anchors reproduce',
    holds: () =>
      Math.abs(R_ANCHOR_1E26 - 0.000979) < 5e-6 &&
      Math.abs(R_CROSS_1E4 - 109.1892) < 1e-3,
  },
  {
    // Independent recompute agrees with the imp-35553 baked spanLadder to printed-digit tolerance.
    id: 'imp35619-agrees-with-imp35553-record',
    description: 'the recompute matches the imp-35553 baked spanLadder crossings and spans',
    holds: () =>
      Math.abs(R_CROSS_1E3 - LADDER[0].crossingLog10N) < 1e-3 &&
      Math.abs(R_CROSS_1E6 - LADDER[3].crossingLog10N) < 1e-2 &&
      Math.abs(R_SPAN_56 - LADDER[3].span) < 1e-2 &&
      Math.abs(R_RATIO_5645 - LADDER[3].ratio) < 1e-3,
  },
  {
    // Honesty gate: regression-guard only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35619-honesty-gate-no-qed',
    description: 'Regression-guard only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION.isRigorous === false &&
      /NO QED/.test(IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION.verdict) &&
      /refereed bound is changed/i.test(IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION.verdict),
  },
];

for (const a of IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35619-eflow-fartail-remnant-span-ladder-assertion assertion failed: ${a.id}`,
    );
  }
}

export default IMP35619_EFLOW_FARTAIL_REMNANT_SPAN_LADDER_ASSERTION;
