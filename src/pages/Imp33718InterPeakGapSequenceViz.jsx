import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33661_CLUSTER_PEAK_SPACING_PERIODICITY_EXTENDED } from '../data/imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js';

const BAR_COLOR = '#38bdf8';
const HIGHLIGHT_COLOR = '#f59e0b';
const MEAN_COLOR = '#64748b';

const { measured } = IMP33661_CLUSTER_PEAK_SPACING_PERIODICITY_EXTENDED;
const gaps = measured.gaps;
const peakNs = measured.peakNs;
const peakEnvs = measured.peakEnvs;

// index of the tallest cluster peak, and the gap INBOUND to it (gaps[i-1] = peakNs[i] - peakNs[i-1])
const tallestIdx = peakEnvs.reduce((best, h, i) => (h > peakEnvs[best] ? i : best), 0);
const tallestN = peakNs[tallestIdx];
const tallestHeight = peakEnvs[tallestIdx];
const inboundGapIdx = tallestIdx - 1; // gaps[inboundGapIdx] is the gap ENDING at peakNs[tallestIdx]
const inboundGap = inboundGapIdx >= 0 ? gaps[inboundGapIdx] : null;

function GapBarChart() {
  const svgW = 700;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const gMax = Math.max(...gaps);
  const barW = (cW / gaps.length) * 0.68;
  const slot = cW / gaps.length;
  const yS = (g) => cH * (1 - g / (gMax * 1.08));
  const meanY = padT + yS(measured.gapMean);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line
        x1={padL}
        y1={meanY}
        x2={padL + cW}
        y2={meanY}
        stroke={MEAN_COLOR}
        strokeWidth={1.1}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={meanY - 4} textAnchor="end" fill={MEAN_COLOR} fontSize={9}>
        mean ~{measured.gapMean.toFixed(1)}
      </text>

      {gaps.map((g, i) => {
        const x = padL + i * slot + (slot - barW) / 2;
        const h = cH - yS(g);
        const y = padT + yS(g);
        const isInbound = i === inboundGapIdx;
        return (
          <rect
            key={`gap-${peakNs[i]}-${peakNs[i + 1]}`}
            x={x}
            y={y}
            width={barW}
            height={h}
            fill={isInbound ? HIGHLIGHT_COLOR : BAR_COLOR}
            rx={1.5}
          />
        );
      })}

      {gaps.map((g, i) => {
        const x = padL + i * slot + slot / 2;
        return (
          <text key={`lbl-${peakNs[i]}`} x={x} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {peakNs[i]}
          </text>
        );
      })}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={9}>
        gap start rung n (peak-to-peak)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={10} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,10,${padT + cH / 2})`}>
        inter-peak gap (rungs)
      </text>
    </svg>
  );
}

export default function Imp33718InterPeakGapSequenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Inter-Peak Gap Sequence, n in [400,1200] (imp-33661)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33661 re-fit the imp-33639 cluster-peak SPACING periodicity across the extended sixteen-peak
        set over [400,1200], finding the inter-peak gap coefficient of variation persists at CV ~
        {measured.gapCV.toFixed(2)} (mean ~{measured.gapMean.toFixed(1)}, sd ~{measured.gapSd.toFixed(1)}).
        This bar chart renders that fifteen-gap sequence directly -- distinct from the imp-33677 viz of the
        earlier imp-33639 nine-gap [400,900] sample -- highlighting the narrow gap feeding into the tallest
        cluster peak.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fifteen inter-peak gaps (rungs), [{gaps.join(', ')}]
      </p>
      <GapBarChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The tallest cluster peak (n ~{tallestN}, envelope ~{tallestHeight.toFixed(1)} ULP) sits at an
        inbound gap of only {inboundGap} rungs -- well below the ~{measured.gapMean.toFixed(1)}-rung mean
        and among the narrowest of the fifteen gaps (min ~{measured.gapMin}, max ~{measured.gapMax}). The
        highlighted bar marks that gap; the dashed line marks the mean gap width.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the ragged bar heights (range ~
        {measured.gapMin}..{measured.gapMax} rungs) illustrate the imp-33661 SPACING-IRREGULAR-CV-PERSISTS
        verdict -- no visible periodic pattern, and the narrowest-gap bar (highlighted) precedes the
        tallest peak rather than a wider one, consistent with the imp-33682 gap-vs-height independence
        finding that wider spacings do not track taller peaks.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement only. It
        changes no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
