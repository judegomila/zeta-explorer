import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96142_ROWS,
  IMP96142_SIGNIFICANT,
  IMP96142_HONEST_BANNER,
} from '../data/imp-96142-decorrelation-safety-margin-viz-data.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// log-scale grouped-bar chart: rho_boundary (physical estimate) vs |rho_crit| (flip threshold)
// per dip height. The gap between the two bars IS the safety margin (or, for the two noise
// heights, the "never promotable" gap since rho_crit there is negative).
function SafetyMarginPanel() {
  const svgW = 640;
  const padL = 50;
  const padR = 16;
  const svgH = 300;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minLog = Math.log10(0.001);
  const maxLog = Math.log10(1);
  const yOf = (v) => padT + plotH - ((Math.log10(v) - minLog) / (maxLog - minLog)) * plotH;
  const yTicks = [0.001, 0.01, 0.1, 1];

  const groupW = plotW / IMP96142_ROWS.length;
  const barW = groupW / 3;

  return (
    <AxisFrame svgW={svgW} svgH={svgH} padL={padL} padR={padR} padT={padT} padB={padB} xLabel="dip height Tc" yLabel="correlation (log scale)">
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.5} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {IMP96142_ROWS.map((r, i) => {
        const cx = padL + i * groupW + groupW / 2;
        const boundaryH = plotH - (yOf(r.rhoBoundary) - padT);
        const critAbs = Math.abs(r.rhoCrit);
        const critH = plotH - (yOf(critAbs) - padT);
        const critColor = r.unconditionallySafe ? '#4ade80' : '#f87171';
        return (
          <g key={r.Tc}>
            <rect x={cx - barW - 2} y={yOf(r.rhoBoundary)} width={barW} height={boundaryH} fill="#38bdf8" opacity={0.85} />
            <text x={cx - barW / 2 - 2} y={yOf(r.rhoBoundary) - 5} textAnchor="middle" fill="#38bdf8" fontSize={8}>
              {r.rhoBoundary.toFixed(4)}
            </text>
            <rect x={cx + 2} y={yOf(critAbs)} width={barW} height={critH} fill={critColor} opacity={0.85} />
            <text x={cx + barW / 2 + 2} y={yOf(critAbs) - 5} textAnchor="middle" fill={critColor} fontSize={8}>
              {r.rhoCrit < 0 ? '-' : ''}{critAbs.toFixed(3)}
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {r.Tc.toExponential(1).replace('+', '')}
            </text>
            <text x={cx} y={padT + plotH + 30} textAnchor="middle" fill="#64748b" fontSize={8}>
              {r.unconditionallySafe ? 'unpromotable' : 'flip threshold'}
            </text>
          </g>
        );
      })}
    </AxisFrame>
  );
}

export default function Imp96142DecorrelationSafetyMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route B/D Robustness: De-Correlation Safety Margin Across the Three Dip Heights" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96142_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For each of the three imp-95562 below-envelope dip heights, blue bars show the physical
        boundary-sharing estimate rho_boundary ~ 1/L; the second bar shows |rho_crit|, the lag-1
        correlation that would flip the height&rsquo;s verdict. Only T = 1.5e5 (red) has a real,
        positive flip threshold (rho_crit = {IMP96142_SIGNIFICANT.rhoCrit.toFixed(4)}) &mdash; about{' '}
        {IMP96142_SIGNIFICANT.safetyRatio.toFixed(1)}x above rho_boundary ={' '}
        {IMP96142_SIGNIFICANT.rhoBoundary.toFixed(4)}. The other two heights (green) have{' '}
        <em>negative</em> rho_crit: no positive correlation could ever promote them, so they are
        unconditionally safe rather than merely far from a threshold.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        rho_boundary vs |rho_crit| per dip height (log scale)
      </h3>
      <SafetyMarginPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Signed safety ratio (rho_crit / rho_boundary) per height
      </h3>
      <table style={{ width: '100%', maxWidth: 700, borderCollapse: 'collapse', fontSize: '0.82rem', color: '#cbd5e1' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Tc</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>dip depth</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>rho_boundary</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>rho_crit</th>
            <th style={{ textAlign: 'right', padding: '4px 8px' }}>safety ratio</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>verdict</th>
          </tr>
        </thead>
        <tbody>
          {IMP96142_ROWS.map((r) => (
            <tr key={r.Tc} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '4px 8px' }}>{r.Tc.toExponential(1).replace('+', '')}</td>
              <td style={{ textAlign: 'right', padding: '4px 8px' }}>{r.relPct.toFixed(2)}%</td>
              <td style={{ textAlign: 'right', padding: '4px 8px' }}>{r.rhoBoundary.toFixed(6)}</td>
              <td style={{ textAlign: 'right', padding: '4px 8px', color: r.unconditionallySafe ? '#4ade80' : '#f87171' }}>
                {r.rhoCrit.toFixed(4)}
              </td>
              <td style={{ textAlign: 'right', padding: '4px 8px' }}>{r.safetyRatio.toFixed(1)}x</td>
              <td style={{ padding: '4px 8px' }}>{r.unconditionallySafe ? 'unconditionally safe' : 'robust by ~285x margin'}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> a negative safety ratio
        (T = 1e4, 3e5) means the crossover already exceeds the window count, so rho_crit is
        negative and de-correlation can never push that height into significance. A positive
        safety ratio (T = 1.5e5) is the only height where the verdict could in principle flip, and
        the ~285x gap between the physical boundary estimate and the flip threshold is the margin
        of robustness reported by imp-96109.
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
        imp-96142 baked viz-data (reshaped verbatim from the imp-96109 rows and significantDip
        block; no re-derivation of the AR-1 de-correlation model). {IMP96142_HONEST_BANNER}
      </div>
    </div>
  );
}
