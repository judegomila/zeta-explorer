import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95583_DISCREPANCY_TAIL_EVT } from '../data/imp-95583-discrepancy-tail-evt.js';
import { IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT } from '../data/imp-95599-discrepancy-negative-tail-evt.js';
import { ED, alpha } from '../styles/tokens.js';

const ROWS = IMP95583_DISCREPANCY_TAIL_EVT.rows;
const NEG_ROWS = IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT.rows;

// Merge the positive-side (imp-95583) and negative-side (imp-95599) records by
// height so the chart and table can show both extremes side by side.
const PAIRED_ROWS = ROWS.map((r) => {
  const neg = NEG_ROWS.find((n) => n.Tc === r.Tc);
  return { ...r, gumbelZmin: neg.gumbelZmin, observedMinExcess: neg.observedMinExcess };
});

// Bar chart of gumbelZ (max side) and gumbelZmin (min side) per height,
// bounded by the |gumbelZ| < 2 band imp-95583/imp-95599 use to call the
// discrepancy tail EVT-consistent on both sides.
function GumbelZBandChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 52;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const yMax = 2.6;
  const yMin = -2.6;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = yOf(0);

  const barW = (plotW / PAIRED_ROWS.length) * 0.22;
  const xOf = (i) => padL + ((i + 0.5) / PAIRED_ROWS.length) * plotW;

  const yTicks = [-2, -1, 0, 1, 2];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* +-2 Gumbel-sd band */}
      <rect x={padL} y={yOf(2)} width={plotW} height={yOf(-2) - yOf(2)} fill={alpha(ED.series1, 0.08)} />
      <line x1={padL} y1={yOf(2)} x2={padL + plotW} y2={yOf(2)} stroke={ED.series1} strokeWidth={1} strokeDasharray="5 3" />
      <line x1={padL} y1={yOf(-2)} x2={padL + plotW} y2={yOf(-2)} stroke={ED.series1} strokeWidth={1} strokeDasharray="5 3" />
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((v) => (
        <text key={`yt${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
          {v}
        </text>
      ))}

      {PAIRED_ROWS.map((r, i) => {
        const zMax = r.gumbelZ;
        const zMin = r.gumbelZmin;
        const maxBarTop = zMax >= 0 ? yOf(zMax) : zeroY;
        const maxBarH = Math.abs(yOf(zMax) - zeroY);
        const maxColor = Math.abs(zMax) < 2 ? ED.series3 : ED.series2;
        const minBarTop = zMin >= 0 ? yOf(zMin) : zeroY;
        const minBarH = Math.abs(yOf(zMin) - zeroY);
        const minColor = Math.abs(zMin) < 2 ? ED.series5 : ED.series2;
        return (
          <g key={r.Tc}>
            <rect
              x={xOf(i) - barW * 1.1}
              y={maxBarTop}
              width={barW}
              height={Math.max(maxBarH, 1)}
              fill={maxColor}
              opacity={0.85}
            />
            <rect
              x={xOf(i) + barW * 0.1}
              y={minBarTop}
              width={barW}
              height={Math.max(minBarH, 1)}
              fill={minColor}
              opacity={0.85}
            />
            <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              {r.Tc.toExponential(0).replace('e+', 'e')}
            </text>
            <text x={xOf(i)} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              N={r.nWindows}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        height T_c
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        gumbelZ (Gumbel sd from EVT mean)
      </text>

      <g>
        <rect x={padL + plotW - 210} y={padT + 4} width={10} height={10} fill={ED.series3} opacity={0.85} />
        <text x={padL + plotW - 196} y={padT + 13} fill={ED.inkSoft} fontSize={9.5}>
          max side (gumbelZ, imp-95583)
        </text>
        <rect x={padL + plotW - 210} y={padT + 20} width={10} height={10} fill={ED.series5} opacity={0.85} />
        <text x={padL + plotW - 196} y={padT + 29} fill={ED.inkSoft} fontSize={9.5}>
          min side (gumbelZmin, imp-95599)
        </text>
      </g>
    </svg>
  );
}

export default function Imp95607GumbelZBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95583 Gumbel-Z Per-Height Band Check" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page charting the imp-95583 gumbelZ record and the imp-95599 gumbelZmin
        record verbatim. It re-derives no bound and changes no result. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95562 measured the worst single-window discrepancy excess max(D) at six
        heights and reported it at 2.9&ndash;3.3 sd(D) above the mean, without asking
        whether that is large for the MAXIMUM of N = nWindows Gaussian draws. imp-95583
        compares each observed max(D) against the Gumbel-predicted E[max] and reports
        gumbelZ = (obs &minus; E[max]) / sd[max]: how many Gumbel standard deviations
        the worst window sits above the EVT-predicted mean maximum, but only checked
        the positive side. imp-95599 recomputes the most-negative window excess
        min(D) at the same six heights and reports gumbelZmin against the
        Gumbel-predicted minimum. Every bar below sits inside the |gumbelZ| &lt; 2
        band both tickets use as their no-outlier threshold, on both sides.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        gumbelZ (max side) and gumbelZmin (min side) per height vs the &plusmn;2
        Gumbel-sd band
      </h3>
      <GumbelZBandChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T_c</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>nWindows</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sd(D)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>observed max(D)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>gumbelZ</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>observed min(D)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>gumbelZmin</th>
          </tr>
        </thead>
        <tbody>
          {PAIRED_ROWS.map((r) => (
            <tr key={r.Tc} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.Tc.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.nWindows}</td>
              <td style={{ textAlign: 'right' }}>{r.sdDiscrepancy.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.observedMaxExcess.toFixed(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.gumbelZ.toFixed(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.observedMinExcess.toFixed(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.gumbelZmin.toFixed(3)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> gumbelZ (max
        side) ranges from {Math.min(...ROWS.map((r) => r.gumbelZ)).toFixed(2)} to{' '}
        {Math.max(...ROWS.map((r) => r.gumbelZ)).toFixed(2)}, mean{' '}
        {IMP95583_DISCREPANCY_TAIL_EVT.aggregates.meanGumbelZ.toFixed(3)}; gumbelZmin
        (min side) ranges from{' '}
        {Math.min(...NEG_ROWS.map((r) => r.gumbelZmin)).toFixed(2)} to{' '}
        {Math.max(...NEG_ROWS.map((r) => r.gumbelZmin)).toFixed(2)}, mean{' '}
        {IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT.aggregates.meanGumbelZmin.toFixed(3)}.
        Every bar on both sides stays inside the shaded &plusmn;2 band and the two
        means are small and opposite in sign -- the worst window at each height,
        positive or negative, is exactly the size the Gumbel extreme of N iid draws
        predicts, and the tail is genuinely two-sided, not merely positive-bias-free.
        The ratio |min(D)|/max(D) runs{' '}
        {IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT.aggregates.absRatioRange.min.toFixed(3)}
        {' .. '}
        {IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT.aggregates.absRatioRange.max.toFixed(3)}{' '}
        across the six heights, centered on{' '}
        {IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT.aggregates.meanAbsRatioMinOverMax.toFixed(3)}.
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
        frozen imp-95583 (max side) and imp-95599 (min side) records (baked
        (T_c, nWindows, gumbelZ, gumbelZmin) tuples, no zeros bundle, no
        re-derivation). Distinct from the imp-95562 D-vs-number-variance envelope
        chart, which plots a different quantity. Changes no bound, establishes no
        operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
