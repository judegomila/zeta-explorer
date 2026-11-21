/**
 * @module imp-96277-route-m-resolvability-curve-viz-data
 *
 * imp-96277 (ux): import-light viz-data leaf for the imp-96248 graded Route M
 * conductor-resolvability curve -- the AICc two-tone preference (and the
 * paired reliable-separation fraction) plotted against log N span, showing
 * the transition from near-zero preference at the current span 3.18 up to
 * the > 90 percent confident-separation threshold that coincides with the
 * Rayleigh span 10.0. imp-96248 baked the curve but shipped no chart.
 *
 * Reshapes the imp-96248 baked eleven-row curve into a chart-ready series
 * (span, N estimate, twoTonePref, reliableSep, relAmpErr, cond) and copies
 * the practical-threshold and verdict literals verbatim. No re-derivation:
 * every plotted value is copied from IMP96248_CURVE / IMP96248_PRACTICAL_SPANS.
 * The N estimate reuses imp-96248's own ladder relation N = 250 * exp(span)
 * (verified against the three baked N anchors: span 6 -> 1.0e5, span 9 ->
 * 2.0e6, span 10 -> 5.5e6).
 *
 * PRESENTATION ONLY. Simulation-derived values (synthetic q4+q5 two-tone plus
 * matched noise); no new zeros, no Gram build, no bound changes, no operator
 * positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96248-route-m-conductor-resolvability-curve.js (baked curve, verdict, sub-gap; imp-96277 viz page)
 *
 * Ticket: imp-96277 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP96248_CURVE,
  IMP96248_PRACTICAL_SPANS,
  IMP96248_VERDICT,
  IMP96248_RAYLEIGH_SPAN,
} from './imp-96248-route-m-conductor-resolvability-curve.js';

// N ladder relation used by imp-96248 (N = 250 * exp(span)); reproduced here
// only to annotate the chart x-axis, not re-derived.
const IMP96277_N_FROM_SPAN = (span) => 250 * Math.exp(span);

// The eleven baked rows, reshaped for plotting against log N span.
export const IMP96277_RESOLVABILITY_SERIES = IMP96248_CURVE.map((row) => ({
  span: row.span,
  nEstimate: IMP96277_N_FROM_SPAN(row.span),
  twoTonePref: row.twoTonePref,
  reliableSep: row.reliableSep,
  relAmpErr: row.relAmpErr,
  cond: row.cond,
  isCurrentSpan: row.span === 3.178,
  isAmpUsableSpan: row.span === IMP96248_PRACTICAL_SPANS.ampRecoveryUsableSpan,
  isRayleighSpan: Math.abs(row.span - IMP96248_RAYLEIGH_SPAN) < 0.01,
}));

export const IMP96277_THRESHOLDS = Object.freeze({
  ampRecoveryUsableSpan: IMP96248_PRACTICAL_SPANS.ampRecoveryUsableSpan,
  ampRecoveryUsableN: IMP96248_PRACTICAL_SPANS.ampRecoveryUsableN,
  aicHalfPrefSpan: IMP96248_PRACTICAL_SPANS.aicHalfPrefSpan,
  reliableSep80Span: IMP96248_PRACTICAL_SPANS.reliableSep80Span,
  reliableSep80N: IMP96248_PRACTICAL_SPANS.reliableSep80N,
  aicPref90Span: IMP96248_PRACTICAL_SPANS.aicPref90Span,
  aicPref90N: IMP96248_PRACTICAL_SPANS.aicPref90N,
  rayleighSpan: IMP96248_RAYLEIGH_SPAN,
  confidentSeparationCoincidesWithRayleigh: IMP96248_PRACTICAL_SPANS.confidentSeparationCoincidesWithRayleigh,
});

export const IMP96277_VERDICT = Object.freeze({
  transitionGraded: IMP96248_VERDICT.transitionGraded,
  confidentSpanEqualsRayleigh: IMP96248_VERDICT.confidentSpanEqualsRayleigh,
  conclusion: IMP96248_VERDICT.conclusion,
});

export const IMP96277_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every span, twoTonePref, reliableSep, '
  + 'relAmpErr and cond value is copied verbatim from the imp-96248 baked resolvability curve; only the N '
  + 'estimate (N = 250 * exp(span), imp-96248 own ladder relation) is computed here for the axis label, no '
  + 'new Monte-Carlo run. Synthetic q4+q5 two-tone simulation only; no new zeros, no Gram build, no bound '
  + 'changes, no operator positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96277_ASSERTIONS = [
  {
    id: 'imp96277-series-matches-source-curve',
    holds: () => IMP96277_RESOLVABILITY_SERIES.every((p, i) => approx(p.span, IMP96248_CURVE[i].span, 1e-12)
      && approx(p.twoTonePref, IMP96248_CURVE[i].twoTonePref, 1e-12)
      && approx(p.reliableSep, IMP96248_CURVE[i].reliableSep, 1e-12)),
    why: 'the reshaped series must reproduce the imp-96248 baked curve row-for-row.',
  },
  {
    id: 'imp96277-series-length-eleven',
    holds: () => IMP96277_RESOLVABILITY_SERIES.length === 11,
    why: 'imp-96248: eleven baked spans from 2.0 to 14.0.',
  },
  {
    id: 'imp96277-n-estimate-matches-baked-anchors',
    holds: () => {
      const at = (span) => IMP96277_RESOLVABILITY_SERIES.find((p) => approx(p.span, span, 1e-9));
      const s6 = at(6.0);
      const s9 = at(9.0);
      const s10 = at(10.0);
      return s6 && s9 && s10
        && Math.abs(s6.nEstimate - IMP96248_PRACTICAL_SPANS.ampRecoveryUsableN) / IMP96248_PRACTICAL_SPANS.ampRecoveryUsableN < 0.05
        && Math.abs(s9.nEstimate - IMP96248_PRACTICAL_SPANS.reliableSep80N) / IMP96248_PRACTICAL_SPANS.reliableSep80N < 0.05
        && Math.abs(s10.nEstimate - IMP96248_PRACTICAL_SPANS.aicPref90N) / IMP96248_PRACTICAL_SPANS.aicPref90N < 0.05;
    },
    why: 'the N = 250 * exp(span) ladder relation must reproduce the three baked N anchors (span 6 -> 1e5, span 9 -> 2e6, span 10 -> 5.5e6) to within 5 percent.',
  },
  {
    id: 'imp96277-flags-present-and-monotone',
    holds: () => {
      const current = IMP96277_RESOLVABILITY_SERIES.find((p) => p.isCurrentSpan);
      const ampUsable = IMP96277_RESOLVABILITY_SERIES.find((p) => p.isAmpUsableSpan);
      const rayleigh = IMP96277_RESOLVABILITY_SERIES.find((p) => p.isRayleighSpan);
      if (!current || !ampUsable || !rayleigh) return false;
      for (let i = 1; i < IMP96277_RESOLVABILITY_SERIES.length; i++) {
        if (IMP96277_RESOLVABILITY_SERIES[i].twoTonePref < IMP96277_RESOLVABILITY_SERIES[i - 1].twoTonePref - 1e-9) return false;
      }
      return current.twoTonePref < ampUsable.twoTonePref && ampUsable.twoTonePref < rayleigh.twoTonePref;
    },
    why: 'the current-span, amp-usable-span and Rayleigh-span rows must be flagged and the AICc preference must climb monotonically across them, matching the imp-96248 graded-transition finding.',
  },
  {
    id: 'imp96277-honest-banner-present',
    holds: () => /RH open/.test(IMP96277_HONEST_BANNER) && /NO QED/.test(IMP96277_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96277_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96277_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96277-route-m-resolvability-curve-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
