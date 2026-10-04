import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { TIER_PRICE } from '../data/imp-95213-tier-certifier-build.js';
import { ED } from '../styles/tokens.js';

// Figures baked verbatim from the imp-95213 TIER_PRICE literals; no new
// computation is performed here (viz/UX only). Two separate units (CPU-days
// vs ball-ops) are shown as two small log-scale bar panels rather than one
// chart, since the "434x below" and "92x above" framings compare different
// quantities.
const CPU_DAYS_BARS = [
  {
    label: 'Direct O(N)-per-cell baseline (dry-run)',
    value: TIER_PRICE.baselines.directCertifierCpuDays,
    color: ED.series2,
  },
  {
    label: 'Single-level Taylor realization (imp-95213, measured)',
    value: TIER_PRICE.fullWindow.cpuDaysBothMetrics,
    color: ED.series1,
  },
];

const BALL_OPS_BARS = [
  {
    label: 'Single-level Taylor realization (imp-95213, measured)',
    value: TIER_PRICE.fullWindow.ballOpsAtSliceRate,
    color: ED.brass,
  },
  {
    label: 'Two-level design budget (target, not built)',
    value: TIER_PRICE.baselines.designTierBudgetBallOps,
    color: ED.series1,
  },
];

function LogBarPanel({ bars, unitLabel }) {
  const svgW = 640;
  const padL = 300;
  const padR = 90;
  const barH = 34;
  const gap = 22;
  const padT = 20;
  const cW = svgW - padL - padR;
  const svgH = padT + bars.length * (barH + gap);

  const logs = bars.map((b) => Math.log10(b.value));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs) - 1; // leave headroom so the smallest bar is visible
  const scale = (v) => ((Math.log10(v) - minLog) / (maxLog - minLog)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bars.map((b, i) => {
        const y = padT + i * (barH + gap);
        const w = Math.max(scale(b.value), 2);
        return (
          <g key={i}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {b.label}
            </text>
            <rect x={padL} y={y} width={cW} height={barH} fill={ED.paper} rx={2} />
            <rect x={padL} y={y} width={w} height={barH} fill={b.color} opacity={0.85} rx={2} />
            <text x={padL + w + 10} y={y + barH / 2 + 4} fill={ED.ink} fontSize={11} fontWeight={700}>
              {b.value.toExponential(3)}
            </text>
          </g>
        );
      })}
      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        {unitLabel} (log scale)
      </text>
    </svg>
  );
}

export default function Imp95242TierCertifierBaselineVsDesignGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Tier-Certifier: Below Baseline, Above Design Budget (imp-95242 / imp-95213)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The single built W1-CERT level (imp-95213, a rigorous degree-80 Taylor panel model) sits on
        two different sides of two different baselines. In CPU-days it beats the direct
        O(N)-per-cell dry-run baseline by {TIER_PRICE.baselines.speedupVsDirect.toFixed(1)}x, well
        past the required ~{TIER_PRICE.baselines.requiredBeat}x line. In ball-ops it sits{' '}
        {TIER_PRICE.baselines.ballOpsRatioVsDesign.toFixed(1)}x ABOVE the two-level design budget,
        because that second level (a frequency-bin/chirp amortization of the per-panel pass) is an
        identified residual optimization that was not built here.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Full-window CPU-days: {TIER_PRICE.baselines.speedupVsDirect.toFixed(1)}x below baseline
      </h3>
      <LogBarPanel bars={CPU_DAYS_BARS} unitLabel="full-window CPU-days" />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Full-window ball-ops: {TIER_PRICE.baselines.ballOpsRatioVsDesign.toFixed(1)}x above design budget
      </h3>
      <LogBarPanel bars={BALL_OPS_BARS} unitLabel="full-window ball-ops" />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the two panels:</strong> they compare different
        quantities, not different views of the same number. The top panel is wall-clock cost
        (CPU-days) against a slow direct-evaluation dry run; the bottom panel is an analytic
        arb-op count against a design target for a two-level architecture that amortizes the
        per-panel O(N) pass via a frequency-bin/chirp recurrence. The single level built here
        clears the CPU-day bar comfortably while still being priced above the
        finer-grained ball-op design budget &mdash; the second level is the residual optimization, not
        built.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reusing the imp-95213
        TIER_PRICE literals verbatim (no new computation). The full-window run itself
        ({TIER_PRICE.fullWindow.cpuDaysBothMetrics.toFixed(1)} CPU-days as priced) was NOT
        launched; this is a sub-range price measurement extrapolated from a hardest-stretch slice.
        Changes no bound. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. No QED.
      </div>
    </div>
  );
}
