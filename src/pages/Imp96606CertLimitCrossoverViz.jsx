import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96606_LADDER_SERIES,
  IMP96606_MARKERS,
  IMP96606_SUMMARY,
  IMP96606_HONEST_BANNER,
} from '../data/imp-96606-cert-limit-crossover-viz-data.js';

// log10(N) x-axis, two log10(y) series -- delta(N) (rising, rose) and the
// lam_min(N) fit (falling, sky-blue) -- with three vertical marker lines:
// the imp-96352 compute ceiling (9916), the measured crossover (~1.08e5)
// where the two curves meet, and the imp-96548 conditioning ceiling (~2.59e7).
function CrossoverPanel() {
  const rows = IMP96606_LADDER_SERIES;
  const svgW = 720;
  const padL = 60;
  const padR = 20;
  const svgH = 360;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => r.logN);
  const minX = Math.min(...xs, IMP96606_MARKERS.logComputeCeilingN) - 0.2;
  const maxX = Math.max(...xs, IMP96606_MARKERS.logRigorousLamMaxCeilingN) + 0.2;
  const allY = rows.flatMap((r) => [r.logDelta, r.logLamMinFit]);
  const minY = Math.min(...allY) - 0.4;
  const maxY = Math.max(...allY) + 0.4;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const yTicks = [minY, (minY + maxY) / 2, maxY];

  const markers = [
    { logN: IMP96606_MARKERS.logComputeCeilingN, label: `compute ${IMP96606_MARKERS.computeCeilingN}`, color: '#4ade80' },
    { logN: IMP96606_MARKERS.logCrossoverN, label: `crossover ${IMP96606_MARKERS.crossoverN.toExponential(3)}`, color: '#f87171' },
    { logN: IMP96606_MARKERS.logRigorousLamMaxCeilingN, label: `cond. ceiling ${IMP96606_MARKERS.rigorousLamMaxCeilingN.toExponential(2)}`, color: '#facc15' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v.toFixed(2)}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            1e{v.toFixed(1)}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <g key={`x${r.N}`}>
          <line x1={xOf(r.logN)} y1={padT + plotH} x2={xOf(r.logN)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
        </g>
      ))}
      <text x={padL} y={padT + plotH + 15} textAnchor="start" fill="#64748b" fontSize={8}>
        1e4
      </text>
      <text x={padL + plotW} y={padT + plotH + 15} textAnchor="end" fill="#64748b" fontSize={8}>
        2.59e7
      </text>

      {/* vertical reference markers */}
      {markers.map((m) => (
        <g key={m.label}>
          <line
            x1={xOf(m.logN)}
            y1={padT}
            x2={xOf(m.logN)}
            y2={padT + plotH}
            stroke={m.color}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xOf(m.logN)}
            y={padT - 8}
            textAnchor="middle"
            fill={m.color}
            fontSize={7.5}
          >
            {m.label}
          </text>
        </g>
      ))}

      {/* delta(N) series -- rising */}
      <polyline
        points={rows.map((r) => `${xOf(r.logN)},${yOf(r.logDelta)}`).join(' ')}
        fill="none"
        stroke="#fb7185"
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle key={`d${r.N}`} cx={xOf(r.logN)} cy={yOf(r.logDelta)} r={3} fill="#fb7185" />
      ))}

      {/* lam_min(N) fit series -- falling */}
      <polyline
        points={rows.map((r) => `${xOf(r.logN)},${yOf(r.logLamMinFit)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle key={`l${r.N}`} cx={xOf(r.logN)} cy={yOf(r.logLamMinFit)} r={3} fill="#38bdf8" />
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        N (log scale)
      </text>
      <text x={16} y={padT + plotH / 2} fill="#94a3b8" fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        value (log scale)
      </text>
    </svg>
  );
}

export default function Imp96606CertLimitCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Double-Precision Cert Limit: delta(N) vs lam_min(N) Crossover" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96606_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96563 showed that verified-Cholesky certification of lam_min(G_N) &gt; 0 in double
        precision needs the rounding shift delta(N) = g_(n+1) I(1,1) H_N to stay below the
        imp-96428 fit lam_min(N) ~ A N^-p. Because delta(N) grows like n&nbsp;u&nbsp;log&nbsp;n
        while lam_min(N) decays like A N^-p, the two curves cross at
        {' '}N ~ {IMP96606_SUMMARY.crossoverN.toExponential(4)} -- about
        {' '}{IMP96606_SUMMARY.factorAboveComputeCeiling.toFixed(2)}x above the compute ceiling
        but {IMP96606_SUMMARY.factorBelowRigorousCeiling.toFixed(1)}x below the conditioning
        ceiling.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        delta(N) (rose, rising) vs lam_min(N) fit (sky-blue, falling), log-log
      </h3>
      <CrossoverPanel />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the rose curve is the
        verified-Cholesky rounding shift delta(N), climbing as N grows; the sky-blue curve is the
        imp-96428 lam_min(N) fit, falling as N grows. The green dashed line marks the imp-96352
        compute ceiling N=9916 (double-precision certification is safe there); the red dashed
        line marks the measured crossover N ~ {IMP96606_SUMMARY.crossoverN.toExponential(3)}
        {' '}where the curves meet and certification stops working; the amber dashed line marks
        the imp-96548 conditioning ceiling N ~ 2.59e7, which sits far to the right of the
        crossover -- the ceiling figure itself is not certifiable in double precision.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96606 viz-data (ladder reshaped verbatim from imp-96591 / imp-96563).
        {' '}{IMP96606_HONEST_BANNER}
      </div>
    </div>
  );
}
