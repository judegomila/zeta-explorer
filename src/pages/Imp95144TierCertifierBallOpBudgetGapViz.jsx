import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { TIER2_PRICE } from '../data/imp-95214-tier2-chirp-level.js';
import { ED } from '../styles/tokens.js';

// Ball-op figures baked verbatim from the imp-95213 (level 1) and imp-95214
// (level 2) data modules; no new computation is performed here (viz/UX only).
const BARS = [
  {
    label: 'Level 1: single-level Taylor (imp-95213, measured)',
    value: TIER2_PRICE.baselines.level1BallOpsFullWindow,
    color: ED.series2,
  },
  {
    label: 'Level 2: frequency-bin chirp (imp-95214, measured)',
    value: TIER2_PRICE.fullWindow.ballOpsAtSliceRate,
    color: ED.brass,
  },
  {
    label: 'Two-level design budget target',
    value: TIER2_PRICE.baselines.designTierBudgetBallOps,
    color: ED.series1,
  },
];

function BallOpBarChart() {
  const svgW = 640;
  const padL = 300;
  const padR = 90;
  const barH = 34;
  const gap = 22;
  const padT = 20;
  const cW = svgW - padL - padR;
  const svgH = padT + BARS.length * (barH + gap);

  const logs = BARS.map((b) => Math.log10(b.value));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs) - 1; // leave headroom so the smallest bar is visible
  const scale = (v) => ((Math.log10(v) - minLog) / (maxLog - minLog)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {BARS.map((b, i) => {
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
        full-window ball-ops (log scale)
      </text>
    </svg>
  );
}

export default function Imp95144TierCertifierBallOpBudgetGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Tier-Certifier Ball-Op Budget Gap (imp-95144 / imp-95213 / imp-95214)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The W1-CERT tier-P/B/S certifier was priced at two built levels. Level 1 (imp-95213, a
        single-level rigorous Taylor panel model) measures{' '}
        {TIER2_PRICE.baselines.level1BallOpsFullWindow.toExponential(3)} full-window ball-ops.
        Level 2 (imp-95214, a frequency-bin/chirp amortization of the panel pass) cuts that to{' '}
        {TIER2_PRICE.fullWindow.ballOpsAtSliceRate.toExponential(3)} — a{' '}
        {TIER2_PRICE.baselines.ballOpsVsLevel1.toFixed(2)}x reduction — but still sits{' '}
        {TIER2_PRICE.baselines.ballOpsRatioVsDesign.toFixed(2)}x above the{' '}
        {TIER2_PRICE.baselines.designTierBudgetBallOps.toExponential(1)} two-level design budget.
      </p>

      <BallOpBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the bars are on a log
        scale, so each visible gap is a large multiplicative jump, not an additive one. Level 1
        was panel-pass-dominated (97% of cost was the per-panel O(N) Arb evaluation); level 2
        amortizes that pass via chirp recurrences, buying the {TIER2_PRICE.baselines.ballOpsVsLevel1.toFixed(2)}x
        drop. The residual gap to the design budget is now recorded as
        cell/reconstruction-dominated rather than panel-dominated — the panel-amortization optimization
        is spent, and the remaining {TIER2_PRICE.baselines.ballOpsRatioVsDesign.toFixed(1)}x is an
        open, unbuilt optimization. The full-window run itself (378 CPU-days as built at level 1, 21.1 at
        level 2) was NOT launched at either level; both are sub-range price measurements
        extrapolated from hardest-stretch slices.
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
        TIER_PRICE and imp-95214 TIER2_PRICE literals verbatim (no new computation). Qualitative
        budget-gap picture only; no bound promoted. No QED.
      </div>
    </div>
  );
}
