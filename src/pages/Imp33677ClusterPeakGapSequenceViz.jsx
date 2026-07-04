import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT } from '../data/imp-33639-cluster-peak-spacing-periodicity-fit.js';

const BAR_COLOR = '#38bdf8';
const MEAN_COLOR = '#f59e0b';
const BAND_COLOR = '#334155';

const { measured } = IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT;
const gaps = measured.gaps;
const peakNs = measured.peakNs;
const gapMean = measured.gapMean;
const gapSd = measured.gapSd;

function GapChart() {
  const svgW = 700;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const gMax = Math.max(...gaps, gapMean + gapSd);
  const barW = (cW / gaps.length) * 0.6;
  const slot = cW / gaps.length;
  const yS = (g) => cH * (1 - g / (gMax * 1.08));
  const meanY = padT + yS(gapMean);
  const bandTopY = padT + yS(gapMean + gapSd);
  const bandBotY = padT + yS(Math.max(0, gapMean - gapSd));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <rect
        x={padL}
        y={bandTopY}
        width={cW}
        height={Math.max(0, bandBotY - bandTopY)}
        fill={BAND_COLOR}
        opacity={0.35}
      />
      <text x={padL + cW - 4} y={bandTopY - 4} textAnchor="end" fill="#94a3b8" fontSize={9}>
        &plusmn;1 sd band (&plusmn;{gapSd.toFixed(1)})
      </text>

      <line x1={padL} y1={meanY} x2={padL + cW} y2={meanY} stroke={MEAN_COLOR} strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + 4} y={meanY - 4} textAnchor="start" fill={MEAN_COLOR} fontSize={9}>
        mean ~{gapMean.toFixed(1)}
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
        const cx = padL + i * slot + slot / 2;
        const cy = padT + yS(g);
        return <circle key={`pt-${peakNs[i]}`} cx={cx} cy={cy - 4} r={2.4} fill="#e2e8f0" />;
      })}

      {gaps.map((g, i) => {
        const x = padL + i * slot + slot / 2;
        return (
          <text key={`lbl-${peakNs[i]}`} x={x} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {i + 1}
          </text>
        );
      })}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={9}>
        gap index i (gap_i = peakN_i+1 - peakN_i)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={10} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,10,${padT + cH / 2})`}>
        inter-peak gap (rungs)
      </text>
    </svg>
  );
}

export default function Imp33677ClusterPeakGapSequenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Cluster-Peak Gap Sequence, n in [400,900] (imp-33639)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33639 fit the combined imp-33599 + imp-33621 nine band-clearing cluster peaks (n ~
        {peakNs.join(', ')}) to candidate spacing models and found the eight inter-peak gaps [{gaps.join(', ')}]
        scatter from {measured.gapMin} to {measured.gapMax} rungs (mean ~{gapMean.toFixed(1)}, sd ~
        {gapSd.toFixed(1)}, CV ~{measured.gapCV.toFixed(2)}) -- the SPACING-IRREGULAR-NOT-QUASI-PERIODIC verdict.
        This chart renders that eight-gap sequence directly, with the mean and the &plusmn;1 sd band overlaid.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eight inter-peak gaps (rungs), [{gaps.join(', ')}]
      </p>
      <GapChart />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> four of the eight bars (65, 75, 53, 50)
        sit above the mean and outside the &plusmn;1 sd band on the high side, while two (26, 19, 17) fall well
        below it -- a &gt; 4x spread (min {measured.gapMin}, max {measured.gapMax}) with no visible periodic
        pattern, consistent with the imp-33639 CV ~{measured.gapCV.toFixed(2)} dispersion reading.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement only. The
        floorUlp(n) band-clearing lattice is jitter-driven (latticeJitterCaveat), so the exact gap values may
        shift under a different platform libm; the robust reading is the qualitative irregular-spacing verdict,
        not the exact numbers. It changes no bound and patches no literal. Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED.
        RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
