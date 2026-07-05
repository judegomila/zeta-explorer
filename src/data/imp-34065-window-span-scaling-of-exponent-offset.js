/**
 * @module imp-34065-window-span-scaling-of-exponent-offset
 *
 * imp-34065 (numerical, frontier-direction): imp-34006 F2 found the pointwise-vs-window
 * effective-exponent offset delta(N) = p_eff(N) - p(N) decays as delta ~ const/(log T0)^2, with
 * the product delta*(log T0)^2 sitting ~4.8 -> 6.6 across the shared ladder tail vs the ANALYTIC
 * S/4 ~ 6.9 predicted for OLS span S = 12 ln10 -- but that S/4 span-law was asserted at a SINGLE
 * span (12 decades) and never tested against varying span. imp-34006 F3 separately found the
 * window-START threshold crossings lead the pointwise crossings by ~half the 12-decade span. This
 * module varies the fixed OLS window span S over {6, 12, 24} decades on the SAME imp-34006 shared
 * ladder and directly tests both span-laws: whether delta*(log T0)^2 tracks S/4 (linear in span)
 * and whether the threshold lead tracks S/2 decades (half the span).
 *
 * THE QUANTITY (identical inherited imp-34006 sub-terms; NO fresh model)
 * ---------------------------------------------------------------------
 *   sigma(N)   = E_coll / (E_trunc + E_flow + E_coll),   evaluated entirely in log-N space
 *   T0         = effectiveHeightForN(N),  L = log T0,  u = log(T0/2pi)
 *   E_coll     = C_C_PINNED sqrt(L / N),  E_flow = ((u+1)/2pi) L e^{-L} Gronwall,  E_trunc = 3.06e-5
 *   p(N)       = -d ln sigma/d ln N            (POINTWISE central FD, step 1e-3; imp-33816/imp-3529)
 *   p_eff(N;S) = -OLS slope over [N, N*10^S]   (WINDOWED, 4 pts/decade; imp-33274) -- SPAN S varied
 * The imp-34006 functions are re-derived verbatim (Newton solve ln N = u + log(u-1), never forming
 * T0 or N, so both estimators stay evaluable past the IEEE-double N ~ 1e308 overflow; imp-33859).
 *
 * THE ANALYTIC PREDICTION (why S/4 and S/2)
 * -----------------------------------------
 * With x = ln N and gap(x) = 1/2 - p(x) ~ 1/(2L) (L ~ x for large N), the OLS slope over a uniform
 * window [x0, x0 + Snat] (Snat = S ln10, span in NAT-log units) reads the local slope at the window
 * CENTROID x0 + Snat/2. Hence:
 *   (A) delta = p_eff(x0) - p(x0) ~ p'(x0) * (Snat/2) ~ (1/(2L^2)) * (Snat/2) = Snat/(4 L^2),
 *       so delta * L^2 -> Snat/4 = (S ln10)/4 -- LINEAR in span S, reproducing imp-34006's ~6.9 at
 *       S = 12 (12 ln10 / 4 = 6.908).
 *   (B) the window-START crossing p_eff(x0) = target lands where the pointwise p(x0 + Snat/2)
 *       reaches target, i.e. Snat/2 in nat-log = S/2 DECADES earlier -- the lead is HALF the span.
 *
 * THE MEASUREMENT: for S in {6, 12, 24} decades, co-tabulate delta*(log T0)^2 across the imp-34006
 * ladder tail and compare to Snat/4; solve the within-1% (p>=0.495) and within-0.1% (p>=0.4995)
 * window-START crossings and compare the lead over the (span-independent) pointwise crossings to
 * S/2 decades.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (S1) delta*(log T0)^2 TRACKS Snat/4 AT EVERY SPAN, APPROACHING FROM BELOW. At the deepest rung
 *        (N = 1e200, L ~ 456): delta*L^2 = 3.370 (S=6, Snat/4 = 3.454, ratio 0.976), 6.622 (S=12,
 *        Snat/4 = 6.908, ratio 0.959), 12.803 (S=24, Snat/4 = 13.816, ratio 0.927). The realized
 *        product is LINEAR in span to ~5-8% -- delta*L^2 / (Snat/4) sits in [0.93, 0.98] and rises
 *        toward 1 with N, the shortfall growing with span (larger windows sample more curvature, so
 *        the finite-L correction to the centroid-slope approximation is larger).
 *   (S2) THE THRESHOLD LEAD TRACKS S/2 DECADES AT EVERY SPAN. The pointwise crossings are span-fixed
 *        at N ~ 1e44.17 (1%) and 1e436.06 (0.1%); the window-START crossings lead them by 2.96/3.00
 *        (S=6, S/2=3), 5.83/5.98 (S=12, S/2=6), 11.33/11.93 (S=24, S/2=12) decades. The deeper
 *        (0.1%, larger L) lead matches S/2 to <1.5% at every span -- the window reads the pointwise
 *        exponent at its centroid exactly as (B) predicts.
 *
 * The punchline: imp-34006's single-span S/4 and half-span claims are the S = 12 slices of two clean
 * SPAN-LINEAR laws -- delta*(log T0)^2 = Snat/4 and threshold-lead = S/2 decades -- both arising from
 * the same mechanism (the fixed OLS window reads the pointwise exponent at its centroid, +Snat/2).
 * Doubling the span doubles both the offset*(log T0)^2 amplitude and the threshold lead.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34006-pointwise-vs-window-exponent-cross-tabulation (F2 single-span S/4; F3 half-span lead)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law; crossings 1e44.17/1e436.06)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (WINDOWED far-tail p_eff, OLS span)
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-34006)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34006 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const PTS_PER_DECADE = 4; // imp-33274/imp-34006 sampling density
const SPANS = [6, 12, 24]; // OLS window spans in decades (imp-34006 tested only 12)

// EXACT imp-34006 sub-terms in log-N space (imp-33859 route: never forms T0 or N).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
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
  const C_F = (u + 1) / TWO_PI;
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL;
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pPointAtLog10(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}
function pWindowAtLog10(dStart, span, pts = PTS_PER_DECADE) {
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

// (S1) For each span S: tabulate delta*(log T0)^2 across the imp-34006 shared ladder and compare
// to the analytic Snat/4 (Snat = S ln10). Report the deepest-rung realized product and ratio.
const LADDER = [12, 20, 30, 44, 60, 100, 150, 200];
const SPAN_TABLE = SPANS.map((S) => {
  const Snat = S * Math.LN10;
  const predQuarter = Snat / 4; // analytic S/4 target for delta*(log T0)^2
  const rungs = LADDER.map((d) => {
    const L = logT0FromLnN(d * Math.LN10).L;
    const pP = pPointAtLog10(d);
    const pW = pWindowAtLog10(d, S);
    const offset = pW - pP;
    return {
      N_log10: d,
      logT0: +L.toFixed(2),
      offset: +offset.toExponential(3),
      offset_times_logT0sq: +(offset * L * L).toFixed(3),
      ratio_to_Snat_over_4: +(offset * L * L / predQuarter).toFixed(3),
    };
  });
  const deepest = rungs[rungs.length - 1];
  return {
    span_decades: S,
    Snat: +Snat.toFixed(3),
    pred_Snat_over_4: +predQuarter.toFixed(3),
    deepest_offset_times_logT0sq: deepest.offset_times_logT0sq, // -> Snat/4 from below
    deepest_ratio_to_Snat_over_4: deepest.ratio_to_Snat_over_4, // -> 1 (0.93..0.98)
    rungs,
  };
});

// (S2) Threshold crossings: pointwise (span-independent) and window-START (per span S), and the lead.
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
function crossWindowStart(target, hiLog10, span) {
  let a = 6;
  let b = hiLog10;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (pWindowAtLog10(m, span) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const POINT_1PCT = crossPoint(0.495, 80); // ~44.17 (imp-33816/imp-34006), span-independent
const POINT_0_1PCT = crossPoint(0.4995, 600); // ~436.06 (imp-33816/imp-34006), span-independent
const LEAD_TABLE = SPANS.map((S) => {
  const w1 = crossWindowStart(0.495, 80, S);
  const w01 = crossWindowStart(0.4995, 600, S);
  return {
    span_decades: S,
    pred_S_over_2_decades: +(S / 2).toFixed(1), // analytic half-span lead
    window_1pct_start_at_N_log10: +w1.toFixed(2),
    lead_1pct_decades: +(POINT_1PCT - w1).toFixed(2), // ~S/2
    window_0_1pct_start_at_N_log10: +w01.toFixed(2),
    lead_0_1pct_decades: +(POINT_0_1PCT - w01).toFixed(2), // ~S/2 (tighter, deeper L)
  };
});

export const IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET = {
  id: 'imp-34065',
  proofSection: 'S-frontier',
  question:
    'Test the imp-34006 F2 analytic S/4 span-law by varying the fixed OLS window span S over ' +
    '{6, 12, 24} decades on the shared ladder: does delta*(log T0)^2 track Snat/4 (linear in span) ' +
    'and does the window-START threshold lead track S/2 decades (half the span)? Measurement/fit ' +
    'only; conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'delta*(log T0)^2 = (p_eff(N;S) - p(N))*(log T0)^2 across the imp-34006 ladder for S in ' +
    '{6,12,24} decades vs the analytic Snat/4 (Snat = S ln10); and the within-1% (p>=0.495) / ' +
    'within-0.1% (p>=0.4995) window-START crossings vs the span-independent pointwise crossings',
  spanTable: SPAN_TABLE,
  leadTable: LEAD_TABLE,
  pointwiseCrossings: {
    within_1pct_at_N_log10: +POINT_1PCT.toFixed(2), // ~44.17, span-independent
    within_0_1pct_at_N_log10: +POINT_0_1PCT.toFixed(2), // ~436.06, span-independent
  },
  farTailExponent: HALF,
  finding: {
    S1_offset_times_logT0sq_tracks_Snat_over_4:
      'delta*(log T0)^2 tracks the analytic Snat/4 at every span, approaching from below: at the ' +
      'deepest rung (N=1e200, L~456) delta*L^2 = 3.370 (S=6, Snat/4=3.454, ratio 0.976), 6.622 ' +
      '(S=12, Snat/4=6.908, ratio 0.959), 12.803 (S=24, Snat/4=13.816, ratio 0.927). The realized ' +
      'product is linear in span to ~5-8% -- ratio in [0.93, 0.98], rising toward 1 with N, the ' +
      'shortfall growing with span as larger windows sample more curvature.',
    S2_threshold_lead_tracks_S_over_2_decades:
      'The pointwise crossings are span-fixed at N~1e44.17 (1%) and 1e436.06 (0.1%); the ' +
      'window-START crossings lead them by 2.96/3.00 (S=6, S/2=3), 5.83/5.98 (S=12, S/2=6), ' +
      '11.33/11.93 (S=24, S/2=12) decades. The deeper 0.1% lead (larger L) matches S/2 to <1.5% at ' +
      'every span -- the fixed window reads the pointwise exponent at its centroid, +Snat/2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Varying the fixed OLS window span S over ' +
    '{6,12,24} decades on the imp-34006 shared ladder, both single-span imp-34006 claims resolve ' +
    'into clean SPAN-LINEAR laws. (S1) delta*(log T0)^2 tracks the analytic Snat/4 at every span, ' +
    'approaching from below -- deepest-rung 3.370/6.622/12.803 vs Snat/4 3.454/6.908/13.816 ' +
    '(ratios 0.976/0.959/0.927), linear in span to ~5-8%, the finite-L shortfall growing with span. ' +
    '(S2) the window-START threshold lead over the span-independent pointwise crossings (1e44.17 / ' +
    '1e436.06) tracks S/2 decades -- 2.96/5.83/11.33 (1%) and 3.00/5.98/11.93 (0.1%) vs 3/6/12 -- ' +
    'the deeper 0.1% lead matching S/2 to <1.5%. Both laws share one mechanism: the fixed OLS window ' +
    'reads the pointwise exponent at its centroid (+Snat/2), so delta ~ p_prime*(Snat/2) = Snat/(4 L^2) ' +
    'and the lead is half the span. imp-34006 F2/F3 are the S=12 slices. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34006 (pointwise-vs-window offset; F2 single-span S/4; F3 half-span lead); imp-33816 ' +
    '(POINTWISE gap law; crossings 1e44.17 / 1e436.06); imp-33274 (WINDOWED far-tail p_eff, OLS ' +
    'span); imp-33859 (log-N-space direct evaluation past IEEE-double overflow); imp-3463 (far-tail ' +
    'leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); polymath15-constant-C-C.',
};

export const IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET_ASSERTIONS = [
  {
    // Reuse gate: the S=12 span reproduces the imp-34006 F2 tail -- deepest-rung delta*(log T0)^2
    // ~ 6.62 near the analytic Snat/4 = 6.908, confirming the identical inherited windowed model.
    id: 'imp34065-reproduces-imp34006-s12-tail',
    description: 'S=12 deepest-rung delta*(log T0)^2 ~ 6.62 reproduces the imp-34006 F2 single-span reading',
    holds: () => {
      const s12 = SPAN_TABLE.find((s) => s.span_decades === 12);
      return Math.abs(s12.deepest_offset_times_logT0sq - 6.62) < 0.2 &&
        Math.abs(s12.pred_Snat_over_4 - 6.908) < 1e-2;
    },
  },
  {
    // (S1): delta*(log T0)^2 tracks Snat/4 at every span, approaching FROM BELOW (ratio < 1),
    // and stays within 10% at the deepest rung -- the span-linear amplitude law.
    id: 'imp34065-offset-times-logT0sq-tracks-Snat-over-4',
    description: 'deepest-rung delta*(log T0)^2 / (Snat/4) in [0.9, 1.0) at S=6,12,24 (linear in span, from below)',
    holds: () =>
      SPAN_TABLE.every(
        (s) => s.deepest_ratio_to_Snat_over_4 > 0.9 && s.deepest_ratio_to_Snat_over_4 < 1.0,
      ),
  },
  {
    // (S1 monotonicity): the finite-L shortfall grows with span -- the deepest-rung ratio to Snat/4
    // strictly DECREASES as the span widens (larger windows sample more curvature).
    id: 'imp34065-ratio-shortfall-grows-with-span',
    description: 'deepest-rung ratio to Snat/4 strictly decreases S=6 -> 12 -> 24 (shortfall grows with span)',
    holds: () => {
      const r = SPAN_TABLE.map((s) => s.deepest_ratio_to_Snat_over_4);
      return r[0] > r[1] && r[1] > r[2];
    },
  },
  {
    // (S2): the window-START threshold lead over the span-independent pointwise crossings tracks
    // S/2 decades at every span; the deeper 0.1% lead (larger L) matches S/2 to within ~5%.
    id: 'imp34065-threshold-lead-tracks-S-over-2',
    description: 'window-START lead ~ S/2 decades at S=6,12,24; 0.1% lead within 5% of S/2',
    holds: () =>
      LEAD_TABLE.every(
        (l) =>
          l.lead_0_1pct_decades < l.lead_1pct_decades + 0.7 && // deeper crossing tighter or comparable
          Math.abs(l.lead_0_1pct_decades - l.pred_S_over_2_decades) < 0.05 * l.pred_S_over_2_decades + 0.1 &&
          l.lead_1pct_decades > 0.9 * l.pred_S_over_2_decades - 0.2, // 1% lead near S/2 too
      ),
  },
  {
    // (S2 linearity): doubling the span doubles the lead -- the S=24 lead is ~2x the S=12 lead,
    // which is ~2x the S=6 lead (span-linear half-span law).
    id: 'imp34065-lead-doubles-with-span',
    description: '0.1% lead doubles across S=6 -> 12 -> 24 (span-linear: ~3, ~6, ~12 decades)',
    holds: () => {
      const l = LEAD_TABLE.map((r) => r.lead_0_1pct_decades);
      return Math.abs(l[1] / l[0] - 2) < 0.15 && Math.abs(l[2] / l[1] - 2) < 0.15;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA.
    id: 'imp34065-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.isRigorous === false &&
      IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict) &&
      /remains SOTA/.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict),
  },
];

for (const a of IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34065-window-span-scaling-of-exponent-offset assertion failed: ${a.id}`);
  }
}
