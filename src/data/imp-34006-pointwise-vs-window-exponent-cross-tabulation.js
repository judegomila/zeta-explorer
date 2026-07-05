/**
 * @module imp-34006-pointwise-vs-window-exponent-cross-tabulation
 *
 * imp-34006 (numerical, frontier-direction): imp-33816 validated the POINTWISE local-exponent
 * shortfall gap(N) = 1/2 - p(N) ~ 1/(2 log T0) over N = 1e12..1e200, and imp-33274 tracked the
 * SAME approach to the imp-3463 far-tail 1/2 asymptote via a far-tail SLIDING-WINDOW effective
 * exponent p_eff (fixed 12-decade OLS span). The two exponent estimators -- one pointwise, one
 * windowed -- have never been placed on a common N ladder. This module co-tabulates both at
 * shared N, reports the systematic pointwise-vs-window offset and whether it decays, and identifies
 * which estimator reaches within 1% / 0.1% of 1/2 first.
 *
 * THE QUANTITY (identical inherited imp-3220 / imp-3406 / imp-3529 / imp-33274 / imp-33816 sub-terms)
 * ---------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited sub-terms, evaluated entirely in log-N
 * space (Newton solve of ln N = u + log(u-1) for u = log(T0/2pi), never forming T0 or N) so both
 * estimators stay evaluable far past the IEEE-double N ~ 1e308 overflow, exactly as imp-33859 did.
 *   - POINTWISE (imp-33816 / imp-3529):  p(N) = -d ln sigma / d ln N   (central FD, step 1e-3)
 *   - WINDOWED  (imp-33274):             p_eff(N) = -slope of OLS(ln sigma vs ln N) over the
 *                                        FIXED 12-decade window [N, N*10^12], 4 points/decade.
 *
 * THE MEASUREMENT: co-tabulate p(N) and p_eff(N) on a shared ladder log10 N in {12,20,30,44,60,
 * 100,150,200}, report the offset delta(N) = p_eff(N) - p(N) (and gap_point - gap_window), test
 * whether it decays, and cross-solve the within-1% / within-0.1% crossings for BOTH estimators.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE WINDOW LEADS THE POINTWISE AT EVERY RUNG. Because the pointwise exponent p(N) rises
 *        monotonely (gap ~ 1/(2 log T0) shrinks), the 12-decade OLS window [N, N*10^12] averages
 *        in HIGHER-N, higher-p contributions, so p_eff(N) > p(N) at every shared N. The offset is
 *        strictly positive: delta = 3.38e-2 at N=1e12, falling to 3.18e-5 at N=1e200. Equivalently
 *        the windowed gap 1/2 - p_eff sits below the pointwise gap at the same N.
 *   (F2) THE OFFSET DECAYS ONE LOG-POWER FASTER THAN THE GAP ITSELF. The pointwise gap decays as
 *        gap ~ 1/(2 log T0) (log T0 * gap -> 1/2), but the pointwise-vs-window offset decays as
 *        delta ~ const / (log T0)^2: the product delta * (log T0)^2 stays O(1)-bounded (~4.8 -> 6.6
 *        across the ladder tail, vs the analytic S/4 ~ 6.9 for span S = 12 ln10) while the RATIO
 *        delta / gap collapses monotonely 7.15e-1 -> 2.91e-2. The two estimators therefore AGREE
 *        asymptotically: their disagreement is sub-leading and vanishes relative to the shared gap.
 *   (F3) THE WINDOW REACHES EACH 1/2-THRESHOLD FIRST, BY ~HALF THE WINDOW SPAN. Solving p >= 0.495
 *        (within 1%) and p >= 0.4995 (within 0.1%) for both estimators: the pointwise crossings sit
 *        at N ~ 1e44.17 and N ~ 1e436.06 (reproducing imp-33816 exactly), while the window-START
 *        crossings sit ~5.8 and ~6.0 decades EARLIER (N ~ 1e38.3 and N ~ 1e430.1). The window
 *        anchored at start N leads the pointwise-at-N by essentially HALF the 12-decade span,
 *        because the 12-decade OLS reads the pointwise exponent near its window CENTRE (~+6 decades).
 *
 * The punchline: on a common N ladder the windowed p_eff and pointwise p are the SAME approach to
 * the imp-3463 1/2 asymptote seen at two offsets -- the window leads because its fixed 12-decade
 * span averages in higher-N contributions, reaching each 1/2-threshold ~half a span (~6 decades)
 * before the pointwise exponent, but the lead SHRINKS in exponent value as ~1/(2 log T0)^2, one
 * log-power faster than the shared gap ~1/(2 log T0), so the two estimators converge onto the same
 * 1/2 law and their offset is asymptotically negligible.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law gap ~ 1/(2 log T0); crossings 1e44.17 / 1e436.06)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (WINDOWED far-tail p_eff, fixed 12-decade OLS span)
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N))
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33274/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33274/imp-33816 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const SPAN_DECADES = 12; // imp-33274 fixed OLS window span
const PTS_PER_DECADE = 4; // imp-33274 sampling density

// EXACT imp-33274/imp-33816 sub-terms in log-N space (imp-33859 route: never forms T0 or N).
// Newton-solve ln N = u + log(u-1) for u = log(T0/2pi), then L = log T0 = u + log(2pi).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN); // seed u ~ ln N for large N
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi, identical to imp-33274/imp-33816
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L (underflows to 0 far out)
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// POINTWISE local exponent p(N) = -d ln sigma / d ln N (imp-33816 central FD, step 1e-3).
function pPointAtLog10(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// WINDOWED effective exponent p_eff = -OLS slope over [10^dStart, 10^(dStart+span)] (imp-33274).
function pWindowAtLog10(dStart, span = SPAN_DECADES, pts = PTS_PER_DECADE) {
  const step = 1 / pts;
  const xs = [];
  const ys = [];
  for (let d = dStart; d <= dStart + span + 1e-9; d += step) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigmaFromLnN(lnN));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// (F1/F2) The shared ladder: co-tabulate pointwise p and windowed p_eff at the SAME N.
const SHARED_LADDER = [12, 20, 30, 44, 60, 100, 150, 200].map((d) => {
  const L = logT0FromLnN(d * Math.LN10).L;
  const pPoint = pPointAtLog10(d);
  const pWindow = pWindowAtLog10(d);
  const gapPoint = HALF - pPoint;
  const gapWindow = HALF - pWindow;
  const offset = pWindow - pPoint; // > 0: window leads pointwise at shared N
  return {
    N_log10: d,
    logT0: +L.toFixed(2),
    p_point: +pPoint.toFixed(6),
    gap_point: +gapPoint.toExponential(3),
    p_window: +pWindow.toFixed(6),
    gap_window: +gapWindow.toExponential(3),
    offset: +offset.toExponential(3), // p_eff - p (systematic window-vs-pointwise offset)
    offset_times_logT0sq: +(offset * L * L).toFixed(3), // -> O(1): offset ~ const/(log T0)^2
    offset_over_gap: +(offset / gapPoint).toExponential(3), // -> 0: offset sub-leading to the gap
  };
});

// (F3) within-1% (p>=0.495) and within-0.1% (p>=0.4995) crossings for BOTH estimators.
function crossPoint(target, hiLog10) {
  let a = 6;
  let b = hiLog10;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (pPointAtLog10(m) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
function crossWindowStart(target, hiLog10) {
  let a = 6;
  let b = hiLog10;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (pWindowAtLog10(m) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const POINT_1PCT = crossPoint(0.495, 80); // ~44.17 (reproduces imp-33816)
const WINDOW_1PCT = crossWindowStart(0.495, 80); // ~38.34 (window START)
const POINT_0_1PCT = crossPoint(0.4995, 600); // ~436.06 (reproduces imp-33816)
const WINDOW_0_1PCT = crossWindowStart(0.4995, 600); // ~430.08 (window START)

// Reuse gate: the crossover-anchored 12-decade window reproduces imp-33274 p_eff ~ 0.4732.
const N_CROSS_LOG10 = Math.log10(3.280294e9); // imp-3444 / imp-33274 crossover ~ 3.280e9
const WINDOW_AT_CROSSOVER = pWindowAtLog10(N_CROSS_LOG10);

export const IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION = {
  id: 'imp-34006',
  proofSection: 'S-frontier',
  question:
    'Cross-tabulate the imp-33816 POINTWISE local-exponent gap law gap(N) = 1/2 - p(N) ~ ' +
    '1/(2 log T0) against the imp-33274 far-tail SLIDING-WINDOW effective exponent p_eff on a ' +
    'shared N ladder: report the systematic pointwise-vs-window offset, whether it decays, and ' +
    'which estimator reaches within 1% / 0.1% of 1/2 first. Measurement/fit only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'pointwise p(N) = -d ln sigma/d ln N and windowed p_eff(N) = -OLS slope over the fixed ' +
    '12-decade window [N, N*10^12] (4 pts/decade), both on log10 N in {12,20,30,44,60,100,150,200}; ' +
    'the offset delta = p_eff - p and its decay; the within-1% (p>=0.495) and within-0.1% ' +
    '(p>=0.4995) crossings for both estimators',
  sharedLadder: SHARED_LADDER,
  windowSpanDecades: SPAN_DECADES,
  crossings: {
    // imp-33816 reproduction (pointwise) + the windowed START crossings that lead them.
    point_within_1pct_at_N_log10: +POINT_1PCT.toFixed(2), // ~44.17 (imp-33816)
    window_within_1pct_start_at_N_log10: +WINDOW_1PCT.toFixed(2), // ~38.34 (window START)
    window_leads_point_at_1pct_decades: +(POINT_1PCT - WINDOW_1PCT).toFixed(2), // ~5.83 (~half span)
    point_within_0_1pct_at_N_log10: +POINT_0_1PCT.toFixed(2), // ~436.06 (imp-33816, imp-33859 direct)
    window_within_0_1pct_start_at_N_log10: +WINDOW_0_1PCT.toFixed(2), // ~430.08 (window START)
    window_leads_point_at_0_1pct_decades: +(POINT_0_1PCT - WINDOW_0_1PCT).toFixed(2), // ~5.98 (~half span)
  },
  reuseCheck: {
    // The crossover-anchored 12-decade window reproduces imp-33274 p_eff ~ 0.4732 (identical model).
    window_at_crossover_p_eff: +WINDOW_AT_CROSSOVER.toFixed(5), // ~0.47322 (imp-33274: 0.47320)
    imp33274_reference_p_eff: 0.4732,
  },
  farTailExponent: HALF, // imp-3463 asymptote both estimators approach from below
  finding: {
    F1_window_leads_pointwise_at_every_rung:
      'Because the pointwise exponent p(N) rises monotonely (gap ~ 1/(2 log T0) shrinks), the ' +
      '12-decade OLS window [N, N*10^12] averages in higher-N/higher-p contributions, so the ' +
      'windowed p_eff(N) > pointwise p(N) at every shared N. The offset delta = p_eff - p is ' +
      'strictly positive, 3.38e-2 at N=1e12 down to 3.18e-5 at N=1e200 -- the windowed gap sits ' +
      'below the pointwise gap at the same N.',
    F2_offset_decays_one_log_power_faster_than_the_gap:
      'The shared gap decays as gap ~ 1/(2 log T0) (log T0 * gap -> 1/2), but the pointwise-vs-window ' +
      'offset decays as delta ~ const/(log T0)^2: delta * (log T0)^2 stays O(1)-bounded (~4.8 -> 6.6 ' +
      'across the ladder tail, matching the analytic S/4 ~ 6.9 for span S = 12 ln10) while the ratio ' +
      'delta/gap collapses monotonely 7.15e-1 -> 2.91e-2. The two estimators agree asymptotically -- ' +
      'their disagreement is sub-leading and vanishes relative to the shared gap.',
    F3_window_reaches_each_threshold_first_by_half_the_span:
      'Solving p>=0.495 (within 1%) and p>=0.4995 (within 0.1%) for both estimators, the pointwise ' +
      'crossings sit at N ~ 1e44.17 and N ~ 1e436.06 (reproducing imp-33816) while the window-START ' +
      'crossings sit ~5.8 and ~6.0 decades earlier (N ~ 1e38.3 and N ~ 1e430.1). The window anchored ' +
      'at start N leads the pointwise-at-N by essentially HALF the 12-decade span, because the ' +
      '12-decade OLS reads the pointwise exponent near its window CENTRE (~+6 decades).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Co-tabulating the imp-33816 POINTWISE local ' +
    'exponent p(N) and the imp-33274 WINDOWED effective exponent p_eff(N) (fixed 12-decade OLS ' +
    'span) on a shared N ladder: the window LEADS the pointwise at every rung (offset delta = ' +
    'p_eff - p > 0, 3.38e-2 at 1e12 -> 3.18e-5 at 1e200) because the 12-decade window averages in ' +
    'higher-N/higher-p contributions; the offset decays as ~const/(log T0)^2, one log-power faster ' +
    'than the shared gap ~1/(2 log T0) (delta/gap collapses 7.15e-1 -> 2.91e-2), so the two ' +
    'estimators converge onto the same imp-3463 1/2 law; and the window reaches within 1% / 0.1% ' +
    'of 1/2 first, its START crossing (1e38.3 / 1e430.1) leading the pointwise (1e44.17 / 1e436.06, ' +
    'reproducing imp-33816) by ~half the 12-decade span (~6 decades). The crossover-anchored window ' +
    'reproduces imp-33274 p_eff ~ 0.4732, confirming the identical inherited model. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33816 (POINTWISE gap law gap ~ 1/(2 log T0); crossings 1e44.17 / 1e436.06); imp-33274 ' +
    '(WINDOWED far-tail p_eff, fixed 12-decade OLS span); imp-33859 (log-N-space direct evaluation ' +
    'past IEEE-double overflow); imp-3529 (LOCAL pointwise exponent p(N)); imp-3463 (far-tail ' +
    'leading form, exponent -> 1/2 from below); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION_ASSERTIONS = [
  {
    // Reuse gate: the crossover-anchored 12-decade window reproduces imp-33274 p_eff ~ 0.4732,
    // proving the identical inherited windowed model is in use before cross-tabulating.
    id: 'imp34006-reproduces-imp33274-crossover-window',
    description: 'crossover-anchored 12-decade window p_eff ~ 0.4732 reproduces imp-33274',
    holds: () => Math.abs(WINDOW_AT_CROSSOVER - 0.4732) < 5e-3,
  },
  {
    // Reuse gate: the pointwise crossings reproduce imp-33816 within-1% (~1e44.17) and
    // within-0.1% (~1e436.06), proving the identical inherited pointwise model.
    id: 'imp34006-reproduces-imp33816-pointwise-crossings',
    description: 'pointwise within-1% at ~1e44.17 and within-0.1% at ~1e436.06 reproduce imp-33816',
    holds: () =>
      Math.abs(POINT_1PCT - 44.17) < 0.2 &&
      Math.abs(POINT_0_1PCT - 436.06) < 0.5 &&
      Math.abs(pPointAtLog10(POINT_1PCT) - 0.495) < 1e-4 &&
      Math.abs(pPointAtLog10(POINT_0_1PCT) - 0.4995) < 1e-4,
  },
  {
    // (F1): the window LEADS the pointwise at every shared rung -- offset = p_eff - p > 0,
    // and both estimators stay strictly below the 1/2 asymptote.
    id: 'imp34006-window-leads-pointwise-every-rung',
    description: 'p_window > p_point at every shared N (offset > 0), both < 1/2',
    holds: () =>
      SHARED_LADDER.every((r) => r.offset > 0 && r.p_window > r.p_point) &&
      SHARED_LADDER.every((r) => r.p_window < HALF && r.p_point < HALF),
  },
  {
    // (F2): the offset decays monotonely and, crucially, faster than the gap -- offset/gap
    // strictly shrinks toward 0 (the window-vs-pointwise disagreement is sub-leading), while
    // offset*(log T0)^2 stays O(1)-bounded (offset ~ const/(log T0)^2, one log-power faster).
    id: 'imp34006-offset-decays-faster-than-gap',
    description: 'offset strictly decreases, offset/gap -> 0 monotonely (<0.05 at 1e200), offset*(log T0)^2 stays O(1)',
    holds: () => {
      for (let i = 1; i < SHARED_LADDER.length; i++) {
        if (!(SHARED_LADDER[i].offset < SHARED_LADDER[i - 1].offset)) return false;
        if (!(SHARED_LADDER[i].offset_over_gap < SHARED_LADDER[i - 1].offset_over_gap)) return false;
      }
      const last = SHARED_LADDER[SHARED_LADDER.length - 1];
      // offset*(log T0)^2 stays order-unity on the ladder tail (exclude the 1e12 ramp rung),
      // bounded well below the gap*(log T0) ~ 0.5 scaling -- offset is ~1/(log T0)^2, gap ~1/(log T0).
      const tailBounded = SHARED_LADDER.slice(1).every(
        (r) => r.offset_times_logT0sq > 1 && r.offset_times_logT0sq < 12,
      );
      return last.offset_over_gap < 0.05 && tailBounded;
    },
  },
  {
    // (F3): the window reaches each 1/2-threshold FIRST -- its START crossing precedes the
    // pointwise crossing by ~half the 12-decade span (~6 decades) at both 1% and 0.1%.
    id: 'imp34006-window-reaches-thresholds-first-by-half-span',
    description: 'window-START crossings lead pointwise by ~half the span (5-7 decades) at 1% and 0.1%',
    holds: () => {
      const lead1 = POINT_1PCT - WINDOW_1PCT;
      const lead01 = POINT_0_1PCT - WINDOW_0_1PCT;
      return (
        WINDOW_1PCT < POINT_1PCT &&
        WINDOW_0_1PCT < POINT_0_1PCT &&
        lead1 > 5 && lead1 < 7 &&
        lead01 > 5 && lead01 < 7 &&
        Math.abs(pWindowAtLog10(WINDOW_1PCT) - 0.495) < 1e-4 &&
        Math.abs(pWindowAtLog10(WINDOW_0_1PCT) - 0.4995) < 1e-4
      );
    },
  },
  {
    // Honesty gate: measurement/fit only, both estimators approach the imp-3463 1/2 asymptote,
    // no QED, PT stays SOTA.
    id: 'imp34006-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.isRigorous === false &&
      IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict) &&
      /remains SOTA/.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict) &&
      /C_mb[^.]*imp-486[^.]*UNTOUCHED/i.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
  },
];

for (const a of IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34006-pointwise-vs-window-exponent-cross-tabulation assertion failed: ${a.id}`);
  }
}
