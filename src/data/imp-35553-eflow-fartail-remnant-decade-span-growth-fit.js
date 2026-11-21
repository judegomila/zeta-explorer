/**
 * @module imp-35553-eflow-fartail-remnant-decade-span-growth-fit
 *
 * imp-35553 (numerical, frontier-direction): imp-35534 continued the imp-35473
 * E_flow far-tail fd-vs-analytic remnant ladder to the sub-1e-5 crossing
 * (N ~ 10^410.0475) on the fixed closed surrogate height map T0 = 2 pi N / log N,
 * and NOTED in passing that the "decade span to shed each further factor of ten"
 * GROWS -- ~83.57 decades from the sub-1e-3 to the sub-1e-4 crossing, then ~300.86
 * decades from the sub-1e-4 to the sub-1e-5 crossing (~3.6x longer). But imp-35534
 * tabulated only those two spans and never fit the growth or projected the next
 * threshold. This module FITS the span-growth law from the two known spans, PROJECTS
 * the sub-1e-6 crossing, and CROSS-CHECKS that projection against a DIRECT bisection
 * of the sub-1e-6 crossing on the identical log-space closed-surrogate channel.
 *
 * THE IDENTICAL LOG-SPACE CHANNEL (byte-faithful to imp-35534, no height-map swap)
 * ------------------------------------------------------------------------------
 * The sub-1e-6 crossing lands at N ~ 10^1467, more than a thousand decades beyond
 * the IEEE-754 double range (N_max ~ 1.80e308), so -- exactly as imp-35534 -- the
 * remnant is evaluated in log-space on u = log N via the closed identity
 *
 *   log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP,
 *   g = log T0 = log(2 pi) + u - log(u),   C_F = (u - log(u) + 1)/(2 pi),
 *
 * which never forms the overflowing N or T0. localExponent is the same central
 * log-log difference (h = 1.0002), and the remnant is |(-1 + 3/u) - localExponent|,
 * byte-identical to imp-35473/imp-35534. The channel reproduces the imp-35413 rung
 * remnant(1e26) = 0.000979 and the imp-35473 sub-1e-4 crossing (log10 N = 109.1892)
 * to the printed digits (verified in the assertions below), confirming this is the
 * SAME math continued, NOT a new model.
 *
 * THE SPAN-GROWTH TABLE AND THE FIT
 * ---------------------------------
 * The crossings (log10 N) and the decade spans between successive threshold decades:
 *
 *   threshold   crossing log10 N    span to shed this decade    span ratio
 *   1e-3        25.6205             --                          --
 *   1e-4        109.1892            83.5687                     --
 *   1e-5        410.0475            300.8583                    3.6001   (span45/span34)
 *   1e-6        1467.7351 (direct)  1057.6875 (direct)          3.5156   (span56/span45)
 *
 * imp-35534 had ONLY the first two spans (83.5687, 300.8583). A constant-ratio
 * (geometric) fit from those two points sets r = span45/span34 = 3.6001 and projects
 *
 *   span(1e-5 -> 1e-6)  ~ 300.8583 * 3.6001 = 1083.13 decades,
 *   sub-1e-6 crossing    ~ 410.0475 + 1083.13 = 10^1493.18.
 *
 * THE FINDING
 * -----------
 * The DIRECT bisection of the sub-1e-6 crossing on the identical channel lands at
 * N ~ 10^1467.7351 (bracketed by N = 1e1400 at remnant 1.0917e-6, above, and
 * N = 1e1500 at 9.6015e-7, below), a span of ~1057.69 decades past the sub-1e-5
 * crossing. The constant-ratio projection (10^1493.18) OVERSHOOTS the true crossing
 * by ~25.44 decades (~1.73%), because the span ratio is NOT constant at ~3.6: it
 * DECLINES (3.6001 for the 34/45 pair, 3.5156 for the 45/56 pair) toward the
 * asymptotic value sqrt(10) ~ 3.1623. That asymptote is exactly what the remnant's
 * leading form remnant ~ 2 loglog N / (log N)^2 (imp-35552) dictates: at a crossing
 * 10^-k ~ A log(u)/u^2 with u = log N gives u_k^2/log(u_k) ~ A*10^k, so log10 u_k ~ k/2
 * and the span ratio u_{k+1}/u_k -> 10^(1/2) = sqrt(10) from ABOVE, the loglog factor
 * making each finite-k ratio slightly larger and slowly fading. So the span growth is
 * genuine (each threshold decade costs progressively more decades of N, a remnant
 * decaying slightly faster than 1/log N yet far slower than any power) but SUB-geometric:
 * a naive constant-ratio read of imp-35534's two spans overstates how deep sub-1e-6 lies.
 * Both the fit and the direct measurement agree sub-1e-6 sits near 10^1468-1493, roughly
 * a thousand decades past sub-1e-5; a nonzero floor would never reach 1e-6 at all.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the two-span note this fits, crossing 10^410.05)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the sub-1e-4 crossing 1.546e109)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the sub-1e-3 crossing 4.17e25)
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (remnant ~ 2 loglogN/(logN)^2 leading form)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall exponent.
// GRONWALL = exp(TC_A1_TRAP), so log GRONWALL = TC_A1_TRAP enters log eFlowWith additively.
const TC_A1_TRAP = 2.37e-4;

// Same central-difference step as imp-35135/imp-35473/imp-35534 (multiplicative h = 1.0002 in N).
const H_LOG = Math.log(1.0002);

// EXACT log of the imp-35473/imp-35534 far-tail E_flow quantity, in log-space on u = log N (no overflow).
// Byte-identical to imp-35534 lnEFlowByLogN: g = log(2pi) + u - log(u), C_F = (u - log(u) + 1)/2pi,
// log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP.
function lnEFlowByLogN(u) {
  const g = LN2PI + u - Math.log(u);
  const lnCF = Math.log((u - Math.log(u) + 1) / TWO_PI);
  return lnCF + Math.log(g) - g + TC_A1_TRAP;
}

// Local log-log decay exponent by the SAME central difference as imp-35534, evaluated in log-space.
function localExponentByLogN(u) {
  return (lnEFlowByLogN(u + H_LOG) - lnEFlowByLogN(u - H_LOG)) / (2 * H_LOG);
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(u) {
  return -1 + 3 / u;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (identical to imp-35473/imp-35534 quantity).
function remnantAtLog10(e) {
  const u = e * Math.LN10; // u = log N
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

// The four crossings on the identical log-space channel (first three reproduce the ladder landmarks).
const CROSS_1E3 = crossingLog10(1e-3, 20, 40); // imp-35413 sub-1e-3
const CROSS_1E4 = crossingLog10(1e-4, 100, 120); // imp-35473 sub-1e-4
const CROSS_1E5 = crossingLog10(1e-5, 400, 500); // imp-35534 sub-1e-5
const CROSS_1E6 = crossingLog10(1e-6, 1400, 1500); // NEW: direct sub-1e-6

// The decade spans to shed each further factor of ten and their ratios.
const SPAN_34 = CROSS_1E4 - CROSS_1E3; // imp-35534 first span ~83.57
const SPAN_45 = CROSS_1E5 - CROSS_1E4; // imp-35534 second span ~300.86
const SPAN_56_DIRECT = CROSS_1E6 - CROSS_1E5; // direct measurement ~1057.69

const RATIO_KNOWN = SPAN_45 / SPAN_34; // the only ratio imp-35534 could form (~3.6001)
const RATIO_ACTUAL = SPAN_56_DIRECT / SPAN_45; // the next, directly measured (~3.5156)

// Constant-ratio (geometric) two-point projection from imp-35534's two spans.
const SPAN_56_PROJECTED = SPAN_45 * RATIO_KNOWN;
const CROSS_1E6_PROJECTED = CROSS_1E5 + SPAN_56_PROJECTED;

const PROJECTION_OVERSHOOT = CROSS_1E6_PROJECTED - CROSS_1E6; // decades the geometric fit overstates
const PROJECTION_OVERSHOOT_PCT = (PROJECTION_OVERSHOOT / CROSS_1E6) * 100;
const SQRT10 = Math.sqrt(10);

const CROSS_1E6_REMNANT_TIMES_LOGN = remnantAtLog10(CROSS_1E6) * (CROSS_1E6 * Math.LN10);

// The span-growth ladder (log10 N crossing, span to shed this decade, running ratio).
const SPAN_LADDER = [
  { threshold: '1e-3', crossingLog10N: +CROSS_1E3.toFixed(4), span: null, ratio: null },
  { threshold: '1e-4', crossingLog10N: +CROSS_1E4.toFixed(4), span: +SPAN_34.toFixed(4), ratio: null },
  { threshold: '1e-5', crossingLog10N: +CROSS_1E5.toFixed(4), span: +SPAN_45.toFixed(4), ratio: +RATIO_KNOWN.toFixed(4) },
  { threshold: '1e-6', crossingLog10N: +CROSS_1E6.toFixed(4), span: +SPAN_56_DIRECT.toFixed(4), ratio: +RATIO_ACTUAL.toFixed(4) },
];

export const IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT = {
  id: 'imp-35553',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-35534 growing "decade-span-to-shed-each-factor-of-ten" law for the E_flow ' +
    'far-tail remnant (83.57 decades for 1e-3 -> 1e-4, 300.86 for 1e-4 -> 1e-5) and project ' +
    'the sub-1e-6 crossing on the identical log-space closed-surrogate channel.',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), evaluate the identical imp-35534 ' +
    'fd-vs-analytic remnant |analytic - fd-surrogate| in log-space on u = log N and bisect ' +
    'the sub-1e-3/1e-4/1e-5 crossings (reproducing the imp-35413/imp-35473/imp-35534 ' +
    'landmarks) plus a DIRECT sub-1e-6 crossing over the bracket [1e1400, 1e1500]. Form the ' +
    'two known spans, fit a constant-ratio (geometric) law, project sub-1e-6, and compare the ' +
    'projection to the direct measurement and to the sqrt(10) asymptote of the span ratio.',
  spanLadder: SPAN_LADDER,
  knownSpans: {
    span_1e3_to_1e4: +SPAN_34.toFixed(4),
    span_1e4_to_1e5: +SPAN_45.toFixed(4),
    ratio_known: +RATIO_KNOWN.toFixed(4),
  },
  geometricProjection: {
    span_1e5_to_1e6_projected: +SPAN_56_PROJECTED.toFixed(4),
    sub1e6_log10N_projected: +CROSS_1E6_PROJECTED.toFixed(4),
  },
  directMeasurement: {
    sub1e6_log10N: +CROSS_1E6.toFixed(4),
    span_1e5_to_1e6_direct: +SPAN_56_DIRECT.toFixed(4),
    ratio_actual: +RATIO_ACTUAL.toFixed(4),
    remnantTimesLogN: +CROSS_1E6_REMNANT_TIMES_LOGN.toFixed(6),
  },
  projectionOvershoot: {
    decades: +PROJECTION_OVERSHOOT.toFixed(4),
    percent: +PROJECTION_OVERSHOOT_PCT.toFixed(3),
    asymptoticRatioSqrt10: +SQRT10.toFixed(4),
  },
  finding: {
    F1_reproduces_prior_landmarks:
      'The log-space channel reproduces the imp-35413 rung remnant(1e26) = 0.000979, the ' +
      'imp-35473 sub-1e-4 crossing (log10 N = 109.1892), and the imp-35534 sub-1e-5 crossing ' +
      '(log10 N = 410.0475) to the printed digits, confirming it is the identical ' +
      'eFlowWith/localExponent/remnant math continued, NOT a new model.',
    F2_span_growth_fit_and_projection:
      'imp-35534 had only two spans (83.5687, 300.8583). A constant-ratio (geometric) fit sets ' +
      'r = 3.6001 and projects span(1e-5 -> 1e-6) ~ 1083.13 decades, sub-1e-6 ~ 10^1493.18.',
    F3_direct_measurement_and_declining_ratio:
      'The DIRECT sub-1e-6 crossing lands at N ~ 10^1467.7351 (span ~1057.69 past sub-1e-5), ' +
      'so the geometric projection OVERSHOOTS by ~25.44 decades (~1.73%). The span ratio is not ' +
      'constant at ~3.6: it declines (3.6001 -> 3.5156) toward sqrt(10) ~ 3.1623, exactly the ' +
      'asymptote the remnant ~ 2 loglog N / (log N)^2 leading form (imp-35552) dictates, so the ' +
      'growth is genuine but SUB-geometric -- a naive constant-ratio read overstates the depth ' +
      'of sub-1e-6; a nonzero floor would never reach 1e-6 at all.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35534 "decade span to shed each factor of ten" grows genuinely but SUB-geometrically. ' +
    'A constant-ratio fit of imp-35534s two spans (83.5687, 300.8583; r = 3.6001) projects the ' +
    'sub-1e-6 crossing at 10^1493.18; a DIRECT bisection on the identical log-space channel puts ' +
    'it at 10^1467.7351 (span ~1057.69 past sub-1e-5), so the geometric projection overshoots by ' +
    '~25.44 decades (~1.73%) because the span ratio declines (3.6001 -> 3.5156) toward the sqrt(10) ' +
    '~ 3.1623 asymptote fixed by the remnant ~ 2 loglogN/(logN)^2 leading form (imp-35552). ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Fitting the imp-35534 growing ' +
    'decade-span law: the constant-ratio (geometric) projection from imp-35534s two spans ' +
    '(83.5687, 300.8583; r = 3.6001) places the sub-1e-6 crossing at 10^1493.18, while a DIRECT ' +
    'bisection of the identical log-space fd-vs-analytic remnant channel (byte-faithful; ' +
    'reproduces the imp-35413 rung 0.000979, the imp-35473 sub-1e-4 crossing 109.1892, and the ' +
    'imp-35534 sub-1e-5 crossing 410.0475 to the digit) puts it at 10^1467.7351 -- a span of ' +
    '~1057.69 decades past sub-1e-5. The geometric fit overshoots by ~25.44 decades (~1.73%) ' +
    'because the span ratio is NOT constant at ~3.6 but declines (3.6001 -> 3.5156) toward ' +
    'sqrt(10) ~ 3.1623, the asymptote fixed by the remnant ~ 2 loglogN/(logN)^2 leading form ' +
    '(imp-35552); the span growth is thus genuine but SUB-geometric. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness ' +
    '(imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent ' +
    '1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35534 (two-span note, fit here; sub-1e-5 crossing 10^410.05); imp-35473 (sub-1e-4 ' +
    'crossing 1.546e109); imp-35413 (sub-1e-3 crossing 4.17e25); imp-35552 (remnant ~ ' +
    '2 loglogN/(logN)^2 leading form); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail ' +
    'E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT_ASSERTIONS = [
  {
    // Faithfulness: the log-space channel reproduces the imp-35413 rung remnant(1e26) = 0.000979.
    id: 'imp35553-reproduces-imp35413-rung',
    description: 'the log-space remnant at N = 1e26 matches the imp-35413 rung value 0.000979',
    holds: () => Math.abs(remnantAtLog10(26) - 0.000979) < 5e-6,
  },
  {
    // Faithfulness: reproduces the imp-35473 sub-1e-4 (109.1892) and imp-35534 sub-1e-5 (410.0475).
    id: 'imp35553-reproduces-prior-crossings',
    description: 'the channel reproduces the imp-35473 sub-1e-4 (109.1892) and imp-35534 sub-1e-5 (410.0475) crossings',
    holds: () =>
      Math.abs(CROSS_1E4 - 109.1892) < 1e-3 && Math.abs(CROSS_1E5 - 410.0475) < 1e-3,
  },
  {
    // The two known spans reproduce imp-35534s tabulated values (83.57, 300.86).
    id: 'imp35553-known-spans-match-imp35534',
    description: 'the two known spans are ~83.57 (1e-3 -> 1e-4) and ~300.86 (1e-4 -> 1e-5)',
    holds: () =>
      Math.abs(SPAN_34 - 83.5687) < 1e-2 && Math.abs(SPAN_45 - 300.8583) < 1e-2,
  },
  {
    // The direct sub-1e-6 crossing sits between 1e1400 and 1e1500, near log10 N ~ 1467.74.
    id: 'imp35553-sub1e6-bracketed',
    description: 'the direct sub-1e-6 crossing lies in log10 N in (1400, 1500), near 1467.74',
    holds: () =>
      CROSS_1E6 > 1400 &&
      CROSS_1E6 < 1500 &&
      remnantAtLog10(1400) > 1e-6 &&
      remnantAtLog10(1500) < 1e-6 &&
      Math.abs(CROSS_1E6 - 1467.7351) < 5e-2,
  },
  {
    // The geometric two-point projection overshoots the direct measurement (span ratio declines).
    id: 'imp35553-geometric-projection-overshoots',
    description: 'the constant-ratio projection (~10^1493.18) overshoots the direct sub-1e-6 (~10^1467.74) by ~25.44 decades',
    holds: () =>
      CROSS_1E6_PROJECTED > CROSS_1E6 &&
      Math.abs(PROJECTION_OVERSHOOT - 25.44) < 0.5 &&
      Math.abs(CROSS_1E6_PROJECTED - 1493.18) < 5e-2,
  },
  {
    // The span ratio declines toward sqrt(10): RATIO_ACTUAL < RATIO_KNOWN and both above sqrt(10).
    id: 'imp35553-ratio-declines-toward-sqrt10',
    description: 'the span ratio declines (3.6001 -> 3.5156) and stays above sqrt(10) ~ 3.1623',
    holds: () =>
      RATIO_ACTUAL < RATIO_KNOWN &&
      RATIO_ACTUAL > SQRT10 &&
      Math.abs(RATIO_KNOWN - 3.6001) < 1e-2 &&
      Math.abs(RATIO_ACTUAL - 3.5156) < 1e-2,
  },
  {
    // The span growth is genuine: each threshold decade costs strictly more decades of N.
    id: 'imp35553-span-growth-genuine',
    description: 'the decade span strictly grows: span_34 < span_45 < span_56',
    holds: () => SPAN_34 < SPAN_45 && SPAN_45 < SPAN_56_DIRECT,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35553-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.isRigorous === false &&
      /NO QED/.test(IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.verdict),
  },
];

for (const a of IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35553-eflow-fartail-remnant-decade-span-growth-fit assertion failed: ${a.id}`,
    );
  }
}

export default IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT;
