import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES } from '../data/imp-33681-peak-minus-trough-amplitude-series-n400-1200.js';

const AMP_COLOR = '#38bdf8';
const FIT_COLOR = '#f59e0b';
const MEAN_COLOR = '#4ade80';
const PEAK_BAR_COLOR = '#f472b6';
const FLOOR_BAR_COLOR = '#94a3b8';

const { measured } = IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES;
const rows = measured.rows;

function AmplitudeChart() {
  const svgW = 900;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nLo = 400;
  const nHi = 1200;
  const yMax = 100;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - Math.min(v, yMax) / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* amplitude mean line */}
      <line
        x1={padL}
        y1={yS(measured.ampMean)}
        x2={padL + cW}
        y2={yS(measured.ampMean)}
        stroke={MEAN_COLOR}
        strokeWidth={1.3}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(measured.ampMean) - 6} fill={MEAN_COLOR} fontSize={9}>
        mean ~{measured.ampMean.toFixed(1)} ULP
      </text>

      {/* amplitude-vs-n least-squares fit line */}
      <line
        x1={xS(nLo)}
        y1={yS(measured.ampIntercept + measured.ampSlope * nLo)}
        x2={xS(nHi)}
        y2={yS(measured.ampIntercept + measured.ampSlope * nHi)}
        stroke={FIT_COLOR}
        strokeWidth={1.3}
      />

      {/* the sixteen amplitude points */}
      {rows.map((r) => (
        <g key={`amp-${r.n}`}>
          <circle cx={xS(r.n)} cy={yS(r.amplitude)} r={3.5} fill={AMP_COLOR} />
          <text x={xS(r.n)} y={yS(r.amplitude) - 7} textAnchor="middle" fill={AMP_COLOR} fontSize={8}>
            {r.amplitude.toFixed(0)}
          </text>
        </g>
      ))}

      {[400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        cluster-peak rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        peak-minus-trough amplitude (ULP)
      </text>
    </svg>
  );
}

function DecompositionBars() {
  const svgW = 420;
  const barH = 22;
  const gap = 14;
  const padL = 140;
  const padR = 60;
  const padT = 10;
  const rowsData = [
    { label: 'peak height slope', value: measured.peakHeightSlope, color: PEAK_BAR_COLOR },
    { label: 'trough floor slope', value: measured.troughFloorSlope, color: FLOOR_BAR_COLOR },
    { label: 'amplitude slope', value: measured.ampSlope, color: AMP_COLOR },
  ];
  const maxAbs = Math.max(...rowsData.map((r) => Math.abs(r.value)), 0.001);
  const cW = svgW - padL - padR;
  const svgH = padT * 2 + rowsData.length * (barH + gap);
  const xScale = (v) => (v / maxAbs) * (cW / 2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rowsData.map((r, i) => {
        const y = padT + i * (barH + gap);
        const barW = xScale(r.value);
        const x0 = padL + cW / 2;
        return (
          <g key={r.label}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {r.label}
            </text>
            <rect
              x={barW >= 0 ? x0 : x0 + barW}
              y={y}
              width={Math.abs(barW)}
              height={barH}
              fill={r.color}
              opacity={0.85}
              rx={2}
            />
            <text
              x={barW >= 0 ? x0 + barW + 6 : x0 + barW - 6}
              y={y + barH / 2 + 4}
              textAnchor={barW >= 0 ? 'start' : 'end'}
              fill={r.color}
              fontSize={10}
            >
              {r.value >= 0 ? '+' : ''}
              {r.value.toFixed(3)}
            </text>
          </g>
        );
      })}
      <line x1={padL + cW / 2} y1={padT - 4} x2={padL + cW / 2} y2={svgH - padT + 4} stroke="#334155" strokeWidth={1} />
    </svg>
  );
}

export default function Imp33716PeakMinusTroughAmplitudeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Peak-Minus-Trough Amplitude Series, n in [400,1200] (imp-33681)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        Neither the imp-33660 cluster-peak HEIGHT fit nor the imp-33662 inter-cluster TROUGH floor fit ever
        differenced the two into a peak-to-trough amplitude. imp-33681 pairs each of the sixteen peaks with
        its bracketing troughs (amp = peak height &minus; mean bracketing trough floor) and tests whether the
        resulting envelope amplitude grows, and whether that growth exceeds the peak-height growth. The chart
        below plots each of the sixteen amplitude points (blue dots), the least-squares amplitude-vs-n fit
        (amber line), and the overall amplitude mean (green, dashed).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        amp(n) at the sixteen cluster-peak rungs: amplitudes, linear fit, and mean
      </p>
      <AmplitudeChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The sixteen amplitudes range {measured.ampMin.toFixed(1)}..{measured.ampMax.toFixed(1)} ULP (mean{' '}
        {measured.ampMean.toFixed(1)}, sd {measured.ampSd.toFixed(1)}), with the minimum at n~
        {rows[measured.amplitudes.indexOf(measured.ampMin)].n} and the maximum at n~{measured.ampArgMaxN}. The
        linear amplitude-vs-n fit has slope {measured.ampSlope >= 0 ? '+' : ''}
        {measured.ampSlope.toFixed(3)} ULP/rung with R&sup2; ~{measured.ampR2.toFixed(2)}, reducing the
        residual RMS from {measured.constRms.toFixed(1)} (null) to {measured.ampRms.toFixed(1)} -- an{' '}
        ~{(measured.ampResidualReduction * 100).toFixed(0)}% reduction.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        growth decomposition: b_amp &asymp; b_peak &minus; b_floor
      </p>
      <DecompositionBars />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the amplitude DOES grow (slope{' '}
        {measured.ampSlope.toFixed(3)} ULP/rung, positive and below-null residual RMS), but that slope sits
        BELOW the imp-33660 peak-height slope ({measured.peakHeightSlope.toFixed(3)} ULP/rung) by almost
        exactly the imp-33662 trough-floor slope ({measured.troughFloorSlope.toFixed(3)} ULP/rung) -- the
        decomposition bars show peak slope minus floor slope landing within{' '}
        {Math.abs(measured.decompositionResidual).toFixed(4)} ULP/rung of the measured amplitude slope. This
        REFUTES the premise that flat troughs would make amplitude growth exceed peak growth: the troughs
        carry a small positive (not flat or declining) slope, which pulls the amplitude growth below the
        peaks'. The trend is concentrated in the two tallest imp-33638 tail clusters near n~1126 and n~1198;
        the first fourteen amplitudes sit in a flat band. Exact per-rung ULP values are jittery
        arithmetic-floor lattice hits -- the robust reading is the qualitative weak-positive-but-below-peak
        conclusion, not the precise fit coefficients.
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
        differences two previously-measured series and changes no bound, patches no literal. Mass-feasibility
        is necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED.
        RH-equivalent, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
