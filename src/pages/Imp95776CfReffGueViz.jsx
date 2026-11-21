import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  REFF_CUTOFF_ROWS,
  REFF_GUE_SATURATED,
  BOX_MIN_ROWS,
  IMP95776_SUMMARY,
} from '../data/imp-95776-cf-reff-gue-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-x line chart: flat-RvM r_eff (diverging) vs GUE-reweighted r_eff (saturating)
// across the near-anchor cutoff c, plus the cutoff-independent saturation asymptote.
function ReffCutoffChart() {
  const svgW = 700;
  const padL = 50;
  const padR = 20;
  const padT = 18;
  const padB = 32;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const cs = REFF_CUTOFF_ROWS.map((r) => r.c);
  const logC = cs.map((c) => Math.log10(c));
  const xMin = Math.min(...logC);
  const xMax = Math.max(...logC);
  const xOf = (c) => padL + ((Math.log10(c) - xMin) / (xMax - xMin)) * plotW;

  const allVals = REFF_CUTOFF_ROWS.flatMap((r) => [r.flat, r.gue]);
  const yMin = Math.min(...allVals) - 0.5;
  const yMax = Math.max(...allVals) + 0.5;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const flatPath = REFF_CUTOFF_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.c)} ${yOf(r.flat)}`).join(' ');
  const guePath = REFF_CUTOFF_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.c)} ${yOf(r.gue)}`).join(' ');
  const satY = yOf(REFF_GUE_SATURATED);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* Cutoff-independent GUE saturation asymptote */}
      <line x1={padL} y1={satY} x2={padL + plotW} y2={satY} stroke={ED.series1} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + plotW} y={satY - 4} textAnchor="end" fill={ED.series1} fontSize={9.5}>
        GUE saturates at {REFF_GUE_SATURATED}x
      </text>

      <path d={flatPath} fill="none" stroke={ED.series7} strokeWidth={2} />
      <path d={guePath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {REFF_CUTOFF_ROWS.map((r) => (
        <g key={`pt-${r.c}`}>
          <circle cx={xOf(r.c)} cy={yOf(r.flat)} r={3.5} fill={ED.series7} />
          <circle cx={xOf(r.c)} cy={yOf(r.gue)} r={3.5} fill={ED.series1} />
          <text x={xOf(r.c)} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.label}
          </text>
        </g>
      ))}

      {[Math.ceil(yMax), Math.floor(yMin)].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      <text x={padL + 4} y={padT + 12} fill={ED.series7} fontSize={10}>flat-RvM r_eff (diverging)</text>
      <text x={padL + 4} y={padT + 26} fill={ED.series1} fontSize={10}>GUE-reweighted r_eff (saturating)</text>
    </svg>
  );
}

// Bar chart of the four box-min gap landmarks: nominal, flat c=1, GUE c=1, GUE saturated.
function BoxMinBarChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 20;
  const padT = 14;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 160;
  const svgH = padT + plotH + padB;

  const gaps = BOX_MIN_ROWS.map((r) => r.gap);
  const yMin = Math.min(...gaps) - 0.02;
  const yMax = 0.01;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = yOf(0);

  const barW = plotW / BOX_MIN_ROWS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1} />
      {BOX_MIN_ROWS.map((r, i) => {
        const x = padL + i * barW + barW * 0.2;
        const w = barW * 0.6;
        const y0 = Math.min(zeroY, yOf(r.gap));
        const h = Math.abs(yOf(r.gap) - zeroY);
        return (
          <g key={r.label}>
            <rect x={x} y={y0} width={w} height={h} fill={i === 3 ? ED.series2 : ED.series5} opacity={0.85} />
            <text x={x + w / 2} y={yOf(r.gap) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {r.gap.toFixed(6)}
            </text>
            <text x={x + w / 2} y={svgH - padB + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp95776CfReffGueViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="GUE Repulsion Regularizes r_eff, but Doesn't Tame It (imp-95776 / imp-95747)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page re-plotting the frozen imp-95747
        literals (no re-derivation, no new computation). It changes no bound
        and proves no RH-relevant theorem. The imp-486 C_mb GUE-conditional
        assumption is reweighted within, not established; no refereed bound is changed.
         NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP95776_SUMMARY.reading}
      </p>

      <ReffCutoffChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1.25rem 0 0.5rem' }}>
        Resulting box-min gap depths at each landmark r_eff (same fixed wedge corner throughout):
      </p>
      <BoxMinBarChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>cutoff c (spacings)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>flat-RvM r_eff</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>GUE-reweighted r_eff</th>
          </tr>
        </thead>
        <tbody>
          {REFF_CUTOFF_ROWS.map((r) => (
            <tr key={r.c} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-7)' }}>{r.flat.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{r.gue.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95776_SUMMARY.verdict}
      </div>
    </div>
  );
}
