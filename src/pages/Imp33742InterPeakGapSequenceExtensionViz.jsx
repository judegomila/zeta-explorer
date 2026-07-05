import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600 } from '../data/imp-33698-cluster-peak-gap-series-1200-1600.js';

const BAR_COLOR = '#38bdf8';
const PRIOR_MAX_COLOR = '#f59e0b';
const MEAN_COLOR = '#64748b';

const { measured } = IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600;
const gaps = measured.gaps;
const peakNs = measured.peakNs;

function GapBarChart() {
  const svgW = 700;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const gMax = Math.max(...gaps, measured.imp33661GapMax);
  const barW = (cW / gaps.length) * 0.5;
  const slot = cW / gaps.length;
  const yS = (g) => cH * (1 - g / (gMax * 1.08));
  const meanY = padT + yS(measured.gapMean);
  const priorMaxY = padT + yS(measured.imp33661GapMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line
        x1={padL}
        y1={priorMaxY}
        x2={padL + cW}
        y2={priorMaxY}
        stroke={PRIOR_MAX_COLOR}
        strokeWidth={1.1}
        strokeDasharray="2,2"
      />
      <text x={padL + 4} y={priorMaxY - 4} textAnchor="start" fill={PRIOR_MAX_COLOR} fontSize={9}>
        imp-33661 [400,1200] max gap ({measured.imp33661GapMax})
      </text>

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
        extension mean ~{measured.gapMean.toFixed(1)}
      </text>

      {gaps.map((g, i) => {
        const x = padL + i * slot + (slot - barW) / 2;
        const h = cH - yS(g);
        const y = padT + yS(g);
        return (
          <rect
            key={`gap-${peakNs[i]}-${peakNs[i + 1]}`}
            x={x}
            y={y}
            width={barW}
            height={h}
            fill={BAR_COLOR}
            rx={1.5}
          />
        );
      })}

      {gaps.map((g, i) => {
        const x = padL + i * slot + slot / 2;
        return (
          <text key={`lbl-${peakNs[i]}`} x={x} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {peakNs[i]}&rarr;{peakNs[i + 1]}
          </text>
        );
      })}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={9}>
        extension cluster peak pair (rung n)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={10} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,10,${padT + cH / 2})`}>
        inter-peak gap (rungs)
      </text>
    </svg>
  );
}

export default function Imp33742InterPeakGapSequenceExtensionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Inter-Peak Gap Sequence, n in [1200,1600] (imp-33698)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33698 measured the inter-peak GAP series on the imp-33679 four [1200,1600] extension cluster
        peaks (n = {peakNs.join(', ')}), complementing the imp-33718 viz of the imp-33661 [400,1200]
        fifteen-gap sequence. The three extension gaps [{gaps.join(', ')}] have mean ~
        {measured.gapMean.toFixed(1)} rungs, ~{measured.gapMeanRatio.toFixed(1)}x the imp-33661 mean, and
        every gap sits above the imp-33661 gap max of {measured.imp33661GapMax}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        three inter-peak gaps (rungs), [{gaps.join(', ')}]
      </p>
      <GapBarChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        Taken alone, the extension gap CV ~{measured.gapCV.toFixed(2)} (roughly
        {' '}{measured.gapCVRatio.toFixed(2)}x the imp-33661 CV ~{measured.imp33661GapCV.toFixed(2)}) would
        read as regularization. But band-clearing across the [1200,1600] window is near-continuous
        (~{(measured.fracClearing * 100).toFixed(1)}% of rungs), so these four peaks are sparse local
        maxima of a saturated floor, not discrete clustered spikes -- the same gap statistic measuring a
        different underlying object.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> all three bars clear the dashed
        imp-33661 max-gap line -- the spacing floor lifts wholesale rather than shifting -- while the
        near-continuous clearing behind these four peaks means the discrete clustered lattice imp-33661
        measured has dissolved into a broad elevated floor. Only three gaps are available, so no
        dispersion statistic here is robust; the qualitative regime change is the reliable reading.
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
