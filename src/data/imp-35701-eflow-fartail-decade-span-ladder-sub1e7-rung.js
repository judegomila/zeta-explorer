/**
 * @module imp-35701-eflow-fartail-decade-span-ladder-sub1e7-rung
 *
 * imp-35701 (numerical, frontier-direction): imp-35663 re-exports the imp-35553
 * E_flow far-tail fd-vs-analytic remnant decade-span ladder -- four crossings
 * (1e-3..1e-6), three spans (83.5687, 300.8583, 1057.6875) and two span ratios
 * (3.6001, 3.5156) declining toward sqrt(10) = 3.1623 -- but it STOPS at the
 * sub-1e-6 crossing (log10 N = 1467.7351) and never adds the sub-1e-7 rung to
 * test whether the ratio decline continues and how the geometric-projection
 * overshoot evolves one rung deeper. This module extends the ladder ONE rung:
 * it bisects the sub-1e-7 crossing on the identical log-space closed-surrogate
 * channel, forms the fourth span and the THIRD span ratio, and re-measures the
 * constant-ratio (geometric) projection overshoot at the deeper rung.
 *
 * THE IDENTICAL LOG-SPACE CHANNEL (byte-faithful to imp-35553/imp-35534)
 * ---------------------------------------------------------------------
 * The sub-1e-7 crossing lands near N ~ 10^5139, thousands of decades beyond the
 * IEEE-754 double range, so -- exactly as imp-35553 -- the remnant is evaluated
 * in log-space on u = log N via the closed identity
 *
 *   log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP,
 *   g = log T0 = log(2 pi) + u - log(u),   C_F = (u - log(u) + 1)/(2 pi),
 *
 * with localExponent the same central log-log difference (h = 1.0002) and the
 * remnant |(-1 + 3/u) - localExponent|. The channel functions here are
 * byte-identical to imp-35553; the assertions below cross-check that the four
 * inherited crossings reproduce the imp-35553 exported ladder to the digit,
 * confirming this is the SAME math continued, NOT a new model.
 *
 * THE EXTENDED LADDER (the sub-1e-7 rung is new)
 * ---------------------------------------------
 *   threshold   crossing log10 N    span to shed this decade    span ratio
 *   1e-3        25.6205             --                          --
 *   1e-4        109.1892            83.5687                     --
 *   1e-5        410.0475            300.8583                    3.6001
 *   1e-6        1467.7351           1057.6875                   3.5156
 *   1e-7        5138.5420 (NEW)     3670.8069 (NEW)             3.4706 (NEW)
 *
 * THE FINDING
 * -----------
 * (1) The DIRECT sub-1e-7 crossing lands at N ~ 10^5138.5420 (bracketed by
 *     remnant(10^4000) = 1.62e-7, above, and remnant(10^6000) = 7.21e-8, below),
 *     a span of ~3670.81 decades past the sub-1e-6 crossing.
 * (2) The THIRD span ratio is 3.4706 -- the decline CONTINUES (3.6001 -> 3.5156
 *     -> 3.4706), each step smaller, and the ratio stays above sqrt(10) = 3.1623,
 *     exactly the asymptote the remnant ~ 2 loglog N / (log N)^2 leading form
 *     (imp-35552) dictates. The span growth is thus genuine but SUB-geometric one
 *     rung deeper too.
 * (3) A constant-ratio (geometric) projection of the sub-1e-7 crossing from the
 *     last known ratio (r = 3.5156, the 45/56 ratio) gives span(1e-6 -> 1e-7) ~
 *     3718.37 decades, sub-1e-7 ~ 10^5186.11, OVERSHOOTING the direct 10^5138.54
 *     by ~47.56 decades. The overshoot in ABSOLUTE decades GROWS (25.44 -> 47.56)
 *     yet in PERCENT it SHRINKS (1.733% -> 0.926%): as the ratio approaches its
 *     sqrt(10) asymptote the step-to-step decline slows, so a constant-ratio read
 *     misprices relatively less at each deeper rung even as the raw decade gap
 *     widens. A nonzero remnant floor would never reach 1e-7 at all.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation,
 * NOT a rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848)
 * untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent
 * 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35663-eflow-fartail-decade-span-growth-viz-data (the four-rung ladder this extends)
 * @see imp-35553-eflow-fartail-remnant-decade-span-growth-fit (the crossing/span/ratio channel)
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (remnant ~ 2 loglogN/(logN)^2 leading form, sqrt(10) asymptote)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 */

import IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT from './imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js';

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall exponent.
const TC_A1_TRAP = 2.37e-4;

// Same central-difference step as imp-35135/imp-35473/imp-35534/imp-35553 (multiplicative h = 1.0002 in N).
const H_LOG = Math.log(1.0002);

// EXACT log of the imp-35553 far-tail E_flow quantity, in log-space on u = log N (no overflow). Byte-identical.
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

// The fd-vs-analytic remnant at a given log10 N exponent e (identical imp-35553 quantity).
function remnantAtLog10(e) {
  const u = e * Math.LN10;
  return Math.abs(analyticSurrogateExponent(u) - localExponentByLogN(u));
}

// Bisect the crossing at threshold thr in log10 N over a straddling bracket [lo, hi] (remnant monotone).
function crossingLog10(thr, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > thr) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The five crossings on the identical log-space channel (first four reproduce the imp-35553 ladder).
const CROSS_1E3 = crossingLog10(1e-3, 20, 40); // imp-35413 sub-1e-3
const CROSS_1E4 = crossingLog10(1e-4, 100, 120); // imp-35473 sub-1e-4
const CROSS_1E5 = crossingLog10(1e-5, 400, 500); // imp-35534 sub-1e-5
const CROSS_1E6 = crossingLog10(1e-6, 1400, 1500); // imp-35553 direct sub-1e-6
const CROSS_1E7 = crossingLog10(1e-7, 4000, 6000); // NEW: direct sub-1e-7 rung

// The decade spans to shed each further factor of ten and their ratios.
const SPAN_34 = CROSS_1E4 - CROSS_1E3;
const SPAN_45 = CROSS_1E5 - CROSS_1E4;
const SPAN_56 = CROSS_1E6 - CROSS_1E5;
const SPAN_67 = CROSS_1E7 - CROSS_1E6; // NEW fourth span

const RATIO_45_34 = SPAN_45 / SPAN_34; // 3.6001
const RATIO_56_45 = SPAN_56 / SPAN_45; // 3.5156
const RATIO_67_56 = SPAN_67 / SPAN_56; // NEW third span ratio

// Constant-ratio (geometric) one-rung-ahead projection: use the last KNOWN ratio (56/45 = 3.5156).
const SPAN_67_PROJECTED = SPAN_56 * RATIO_56_45;
const CROSS_1E7_PROJECTED = CROSS_1E6 + SPAN_67_PROJECTED;

const OVERSHOOT_67 = CROSS_1E7_PROJECTED - CROSS_1E7; // decades the geometric fit overstates at the new rung
const OVERSHOOT_67_PCT = (OVERSHOOT_67 / CROSS_1E7) * 100;

// The prior (imp-35553) sub-1e-6 overshoot, recomputed here for the trend comparison.
const SPAN_56_PROJECTED = SPAN_45 * RATIO_45_34;
const CROSS_1E6_PROJECTED = CROSS_1E5 + SPAN_56_PROJECTED;
const OVERSHOOT_56 = CROSS_1E6_PROJECTED - CROSS_1E6;
const OVERSHOOT_56_PCT = (OVERSHOOT_56 / CROSS_1E6) * 100;

const SQRT10 = Math.sqrt(10);
const CROSS_1E7_REMNANT_TIMES_LOGN = remnantAtLog10(CROSS_1E7) * (CROSS_1E7 * Math.LN10);

// The extended span-growth ladder (log10 N crossing, span to shed this decade, running ratio).
const SPAN_LADDER = [
  { threshold: '1e-3', crossingLog10N: +CROSS_1E3.toFixed(4), span: null, ratio: null },
  { threshold: '1e-4', crossingLog10N: +CROSS_1E4.toFixed(4), span: +SPAN_34.toFixed(4), ratio: null },
  { threshold: '1e-5', crossingLog10N: +CROSS_1E5.toFixed(4), span: +SPAN_45.toFixed(4), ratio: +RATIO_45_34.toFixed(4) },
  { threshold: '1e-6', crossingLog10N: +CROSS_1E6.toFixed(4), span: +SPAN_56.toFixed(4), ratio: +RATIO_56_45.toFixed(4) },
  { threshold: '1e-7', crossingLog10N: +CROSS_1E7.toFixed(4), span: +SPAN_67.toFixed(4), ratio: +RATIO_67_56.toFixed(4) },
];

export const IMP35701_EFLOW_FARTAIL_DECADE_SPAN_LADDER_SUB1E7_RUNG = {
  id: 'imp-35701',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35663/imp-35553 E_flow far-tail remnant decade-span ladder one rung to the ' +
    'sub-1e-7 crossing: measure its log10 N, form the fourth span and the third span ratio, and ' +
    're-measure whether the ratio keeps declining toward sqrt(10) and how the geometric-projection ' +
    'overshoot evolves one rung deeper.',
  method:
    'On the identical log-space closed-surrogate channel (byte-faithful to imp-35553; T0 = 2 pi N / ' +
    'log N, remnant |analytic - fd-surrogate| on u = log N), bisect the sub-1e-3..1e-6 crossings ' +
    '(reproducing the imp-35553 ladder) plus a DIRECT sub-1e-7 crossing over the bracket ' +
    '[1e4000, 1e6000]. Form the fourth span and the third span ratio, project the sub-1e-7 crossing ' +
    'from the last known ratio (3.5156), and compare the overshoot to the imp-35553 sub-1e-6 reading.',
  spanLadder: SPAN_LADDER,
  newRung: {
    threshold: '1e-7',
    sub1e7_log10N: +CROSS_1E7.toFixed(4),
    span_1e6_to_1e7: +SPAN_67.toFixed(4),
    ratio_67_56: +RATIO_67_56.toFixed(4),
    remnantTimesLogN: +CROSS_1E7_REMNANT_TIMES_LOGN.toFixed(6),
  },
  geometricProjection: {
    span_1e6_to_1e7_projected: +SPAN_67_PROJECTED.toFixed(4),
    sub1e7_log10N_projected: +CROSS_1E7_PROJECTED.toFixed(4),
    ratioUsed: +RATIO_56_45.toFixed(4),
  },
  projectionOvershoot: {
    sub1e7_decades: +OVERSHOOT_67.toFixed(4),
    sub1e7_percent: +OVERSHOOT_67_PCT.toFixed(3),
    prior_sub1e6_decades: +OVERSHOOT_56.toFixed(4),
    prior_sub1e6_percent: +OVERSHOOT_56_PCT.toFixed(3),
    asymptoticRatioSqrt10: +SQRT10.toFixed(4),
  },
  finding: {
    F1_new_sub1e7_crossing:
      'The DIRECT sub-1e-7 crossing lands at N ~ 10^5138.5420 (bracketed by remnant(1e4000) = ' +
      '1.62e-7, above, and remnant(1e6000) = 7.21e-8, below), a span of ~3670.81 decades past the ' +
      'imp-35553 sub-1e-6 crossing (10^1467.7351).',
    F2_ratio_decline_continues:
      'The third span ratio is 3.4706 -- the decline continues (3.6001 -> 3.5156 -> 3.4706), each ' +
      'step smaller, and stays above sqrt(10) = 3.1623, the asymptote fixed by the remnant ~ ' +
      '2 loglogN/(logN)^2 leading form (imp-35552). The span growth is genuine but SUB-geometric ' +
      'one rung deeper too.',
    F3_overshoot_evolves:
      'A constant-ratio projection from the last known ratio (3.5156) places sub-1e-7 at ' +
      '10^5186.11, overshooting the direct 10^5138.54 by ~47.56 decades. The overshoot in absolute ' +
      'decades GROWS (25.44 -> 47.56) yet in PERCENT it SHRINKS (1.733% -> 0.926%): as the ratio ' +
      'nears its sqrt(10) asymptote the step-to-step decline slows, so the constant-ratio read ' +
      'misprices relatively less each rung even as the raw decade gap widens.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35663/imp-35553 decade-span ladder, extended one rung: the sub-1e-7 crossing sits at ' +
    '10^5138.5420 (span ~3670.81 past sub-1e-6). The third span ratio 3.4706 continues the decline ' +
    '(3.6001 -> 3.5156 -> 3.4706) toward sqrt(10) = 3.1623. A constant-ratio projection (r = 3.5156) ' +
    'overshoots by ~47.56 decades: the absolute overshoot grows (25.44 -> 47.56) but the percent ' +
    'overshoot shrinks (1.733% -> 0.926%). Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35663/imp-35553 E_flow ' +
    'far-tail remnant decade-span ladder one rung: the DIRECT sub-1e-7 crossing on the identical ' +
    'log-space fd-vs-analytic remnant channel (byte-faithful; reproduces the imp-35553 sub-1e-3.. ' +
    'sub-1e-6 crossings to the digit) lands at 10^5138.5420, a span of ~3670.81 decades past ' +
    'sub-1e-6. The third span ratio 3.4706 continues the decline (3.6001 -> 3.5156 -> 3.4706) toward ' +
    'sqrt(10) = 3.1623, the asymptote fixed by the remnant ~ 2 loglogN/(logN)^2 leading form ' +
    '(imp-35552), so the growth stays genuine but SUB-geometric. A constant-ratio projection ' +
    '(r = 3.5156) overshoots by ~47.56 decades: the absolute overshoot grows (25.44 -> 47.56) yet ' +
    'the percent overshoot shrinks (1.733% -> 0.926%). Measurement only on the inherited imp-3220/ ' +
    'imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35663 (four-rung ladder viz-data, extended here); imp-35553 (crossing/span/ratio channel, ' +
    'sub-1e-6 crossing 10^1467.7351); imp-35552 (remnant ~ 2 loglogN/(logN)^2 leading form, sqrt(10) ' +
    'asymptote); imp-35198 (analytic -1 + 3/log N); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export default IMP35701_EFLOW_FARTAIL_DECADE_SPAN_LADDER_SUB1E7_RUNG;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const INHERITED = IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.spanLadder;

const IMP35701_ASSERTIONS = [
  {
    id: 'imp35701-reproduces-imp35553-first-four-rungs',
    description: 'the channel reproduces the imp-35553 sub-1e-3..sub-1e-6 crossings to the digit',
    holds: () =>
      Math.abs(CROSS_1E3 - INHERITED[0].crossingLog10N) < 1e-3 &&
      Math.abs(CROSS_1E4 - INHERITED[1].crossingLog10N) < 1e-3 &&
      Math.abs(CROSS_1E5 - INHERITED[2].crossingLog10N) < 1e-3 &&
      Math.abs(CROSS_1E6 - INHERITED[3].crossingLog10N) < 1e-3,
  },
  {
    id: 'imp35701-five-rungs-present',
    description: 'the extended ladder has five rungs (1e-3..1e-7)',
    holds: () => SPAN_LADDER.length === 5 && SPAN_LADDER[4].threshold === '1e-7',
  },
  {
    id: 'imp35701-sub1e7-bracketed',
    description: 'the direct sub-1e-7 crossing lies in log10 N in (4000, 6000), near 5138.54',
    holds: () =>
      CROSS_1E7 > 4000 &&
      CROSS_1E7 < 6000 &&
      remnantAtLog10(4000) > 1e-7 &&
      remnantAtLog10(6000) < 1e-7 &&
      Math.abs(CROSS_1E7 - 5138.5420) < 5e-2,
  },
  {
    id: 'imp35701-third-ratio-continues-decline',
    description: 'the third span ratio 3.4706 continues the decline and stays above sqrt(10)',
    holds: () =>
      RATIO_67_56 < RATIO_56_45 &&
      RATIO_56_45 < RATIO_45_34 &&
      RATIO_67_56 > SQRT10 &&
      Math.abs(RATIO_67_56 - 3.4706) < 1e-2,
  },
  {
    id: 'imp35701-span-growth-genuine',
    description: 'the decade span strictly grows: span_45 < span_56 < span_67',
    holds: () => SPAN_45 < SPAN_56 && SPAN_56 < SPAN_67,
  },
  {
    id: 'imp35701-overshoot-decades-grow-percent-shrinks',
    description: 'the projection overshoot grows in decades (25.44 -> 47.56) but shrinks in percent (1.733 -> 0.926)',
    holds: () =>
      CROSS_1E7_PROJECTED > CROSS_1E7 &&
      OVERSHOOT_67 > OVERSHOOT_56 &&
      OVERSHOOT_67_PCT < OVERSHOOT_56_PCT &&
      Math.abs(OVERSHOOT_67 - 47.5647) < 0.1 &&
      Math.abs(OVERSHOOT_67_PCT - 0.926) < 0.02,
  },
  {
    id: 'imp35701-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35701_EFLOW_FARTAIL_DECADE_SPAN_LADDER_SUB1E7_RUNG.isRigorous === false &&
      /NO QED/.test(IMP35701_EFLOW_FARTAIL_DECADE_SPAN_LADDER_SUB1E7_RUNG.verdict) &&
      /refereed bound is changed/i.test(IMP35701_EFLOW_FARTAIL_DECADE_SPAN_LADDER_SUB1E7_RUNG.verdict),
  },
];

for (const a of IMP35701_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35701-eflow-fartail-decade-span-ladder-sub1e7-rung assertion failed: ${a.id}`,
    );
  }
}
