import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96160_CONFIGS,
  IMP96160_HEIGHT_SUMMARY,
  IMP96160_SUMMARY,
  IMP96160_HONEST_BANNER,
} from '../data/imp-96160-max-anchor-window-robustness-viz-data.js';
import { ED } from '../styles/tokens.js';

const GROUP_SIZE = 12;
const HEIGHT_LABELS = { 20000: '2e4', 100000: '1e5', 200000: '2e5', 400000: '4e5' };

// Signed-sqrt scale: keeps the two sub-1% breaches visible next to margins up to ~80%.
const signedSqrt = (v) => Math.sign(v) * Math.sqrt(Math.abs(v));

function RobustnessSweepChart() {
  const svgW = 780;
  const svgH = 360;
  const padL = 54;
  const padR = 16;
  const padT = 16;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const nGroups = IMP96160_HEIGHT_SUMMARY.length;
  const slots = IMP96160_CONFIGS.length + (nGroups - 1); // one extra gap slot between groups
  const slotW = plotW / slots;
  const barW = slotW * 0.78;

  const xOf = (index) => {
    const groupIdx = Math.floor(index / GROUP_SIZE);
    return padL + (index + groupIdx) * slotW + slotW / 2;
  };

  const tMin = signedSqrt(-1);
  const tMax = signedSqrt(80);
  const yOf = (v) => padT + plotH - ((signedSqrt(v) - tMin) / (tMax - tMin)) * plotH;

  const yTicks = [-1, 0, 1, 5, 20, 50, 80];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line
            x1={padL}
            y1={yOf(v)}
            x2={padL + plotW}
            y2={yOf(v)}
            stroke={v === 0 ? ED.rule : ED.rule}
            strokeWidth={v === 0 ? 1.2 : 0.5}
            opacity={v === 0 ? 0.8 : 0.4}
          />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}%
          </text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96160_HEIGHT_SUMMARY.map((h, gi) => {
        if (gi === 0) return null;
        const boundaryIdx = gi * GROUP_SIZE;
        const bx = padL + (boundaryIdx + gi - 0.5) * slotW;
        return (
          <line
            key={`div-${h.Tc}`}
            x1={bx}
            y1={padT}
            x2={bx}
            y2={padT + plotH}
            stroke={ED.rule}
            strokeWidth={0.75}
            strokeDasharray="2 3"
            opacity={0.6}
          />
        );
      })}

      {IMP96160_CONFIGS.map((c, i) => {
        const cx = xOf(i);
        const y0 = yOf(0);
        const y1 = yOf(c.marginRelPct);
        const top = Math.min(y0, y1);
        const height = Math.max(Math.abs(y1 - y0), 1);
        const color = c.caps ? ED.series3 : ED.series2;
        return (
          <g key={`${c.Tc}-${c.tag}`}>
            <rect x={cx - barW / 2} y={top} width={barW} height={height} fill={color} opacity={c.isCanonical ? 1 : 0.6} />
            {c.isCanonical && (
              <rect x={cx - barW / 2 - 0.75} y={top} width={barW + 1.5} height={height} fill="none" stroke={ED.brassDeco} strokeWidth={1.1} />
            )}
            {!c.caps && (
              <text x={cx} y={top - 4} textAnchor="middle" fill={ED.series2} fontSize={7.5}>
                {c.marginRelPct.toFixed(2)}%
              </text>
            )}
          </g>
        );
      })}

      {IMP96160_HEIGHT_SUMMARY.map((h, gi) => {
        const groupStart = gi * GROUP_SIZE;
        const groupEnd = groupStart + GROUP_SIZE - 1;
        const cx = (xOf(groupStart) + xOf(groupEnd)) / 2;
        return (
          <text key={`label-${h.Tc}`} x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
            T = {HEIGHT_LABELS[h.Tc] || h.Tc}
          </text>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        held-out height (12-config sweep per height: half-width k, half-span, box-overlap)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        margin (signed-sqrt scale)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <rect x={0} y={-6} width={10} height={10} fill={ED.series3} opacity={0.6} />
        <text x={14} y={2} fill={ED.inkSoft} fontSize={8.5}>caps (residualMax &ge; 0)</text>
        <rect x={130} y={-6} width={10} height={10} fill={ED.series2} opacity={0.6} />
        <text x={144} y={2} fill={ED.inkSoft} fontSize={8.5}>breach</text>
        <rect x={195} y={-6} width={10} height={10} fill="none" stroke={ED.brassDeco} strokeWidth={1.1} />
        <text x={209} y={2} fill={ED.inkSoft} fontSize={8.5}>imp-96090 canonical window (k=1)</text>
      </g>
    </svg>
  );
}

export default function Imp96160MaxAnchorWindowRobustnessViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96132: Max-Anchor Window-Robustness Sweep Across Four Held-Out Heights" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 800,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96160_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 800 }}>
        imp-96112 found the imp-96090 max-anchor cap robust to the sd(C&#8211;E) window estimator
        (half-width, half-span, box-overlap) across a 12-config sweep, but only at the single
        tightest held-out height T&nbsp;=&nbsp;5e4. This sweep repeats the identical 12 configs at
        the other four imp-96090 held-out heights. Of the {IMP96160_SUMMARY.totalConfigs} configs
        tested, {IMP96160_SUMMARY.totalCaps} cap and {IMP96160_SUMMARY.totalBreaches} breach the
        envelope &mdash; both breaches sit at the two endpoint heights (T&nbsp;=&nbsp;2e4, T&nbsp;=&nbsp;4e5),
        each at a single adversarial extreme window (coarsest k at 2e4, finest k at 4e5). The gold-outlined
        bar in each group is the imp-96090 canonical window, which caps with comfortable margin at every height.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Margin per config, all 48 rows (signed-sqrt y-scale)
      </h3>
      <RobustnessSweepChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Per-height summary
      </h3>
      <table style={{ width: '100%', maxWidth: 800, borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Tc</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>canonical margin</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>margin range (12 configs)</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>breaches</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>verdict</th>
          </tr>
        </thead>
        <tbody>
          {IMP96160_HEIGHT_SUMMARY.map((h) => (
            <tr key={h.Tc} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '4px 8px' }}>{HEIGHT_LABELS[h.Tc] || h.Tc}</td>
              <td style={{ textAlign: 'right', padding: '4px 8px', color: 'var(--series-3)' }}>
                +{h.canonicalMarginRelPct.toFixed(1)}%
              </td>
              <td style={{ textAlign: 'right', padding: '4px 8px' }}>
                {h.marginRangePct.min.toFixed(2)}% .. {h.marginRangePct.max.toFixed(1)}%
              </td>
              <td style={{ padding: '4px 8px', color: h.allCap ? 'var(--series-3)' : 'var(--series-2)' }}>
                {h.allCap ? 'none (12/12)' : h.breaches.map((b) => `${b.tag} (${b.marginRelPct.toFixed(2)}%)`).join(', ')}
              </td>
              <td style={{ padding: '4px 8px' }}>{h.allCap ? 'uniformly capped' : 'endpoint breach'}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the y-axis uses a
        signed-square-root scale so the two shallow endpoint breaches (&#8722;0.47% at T=2e4,
        &#8722;0.0019% at T=4e5) stay visible next to margins as large as +79%. The two interior
        heights (T=1e5, T=2e5) are uniformly green &mdash; every one of their 12 configs caps &mdash;
        matching the clean window-robustness imp-96112 found at T=5e4. The breaches are confined to
        a single extreme window per endpoint height, not a failure of the imp-96090 canonical-window
        cap, which stays comfortably positive (gold-outlined bars) everywhere.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96132 baked margin table verbatim (no re-derivation of sd(C&#8211;E), the window sweep,
        or the max-anchor envelope). Changes no bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
